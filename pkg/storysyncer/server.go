package storysyncer

import (
	"context"
	"fmt"
	"log"
	"os"
	"sync"

	"cloud.google.com/go/firestore"
	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/sheets/v4"
)

const (
	StoriesCollection = "stories2"
)

type Server struct {
	sheetsClient    *sheets.Service
	firestoreClient *firestore.Client
	stories         []Story
	// sheetsMetadataCHAN chan *SheetsMetadata

	sheetsLock sync.Mutex

	engine *gin.Engine
}

type SheetsMetadata struct {
	SheetsToMonitor []string
}

// InitServer gives you the object off which to hang most functions.
// panics on fail for certain initialisation
func InitServer(ctx context.Context) (s *Server) {

	s = &Server{
		sheetsClient:    GetSheetsService(ctx),
		firestoreClient: GetFirestoreClient(ctx),
	}

	snapshotQueryItr := s.firestoreClient.Collection(StoriesCollection).Snapshots(ctx)

	go s.listenForStoryChanges(snapshotQueryItr)

	return

}

// listenForStoryChanges monitors snapshot and updates server state when it happens
func (s *Server) listenForStoryChanges(querySnapshotItr *firestore.QuerySnapshotIterator) {
	for {

		querySnapshot, err := querySnapshotItr.Next()
		if err != nil {
			fmt.Println("error getting next querySnapshot", err.Error())
			continue
		}

		snapshots, err := querySnapshot.Documents.GetAll()
		if err != nil {
			fmt.Println("error decoding querySnapshot", err.Error())
			continue
		}

		var newStories []Story
		for _, snapshot := range snapshots {
			var newStory Story
			err = snapshot.DataTo(&newStory)
			if err != nil {
				fmt.Println("error decoding", err.Error())
				continue
			}
			newStory.ID = snapshot.Ref.ID

			newStories = append(newStories, newStory)
		}

		// if successful, update the server state
		s.sheetsLock.Lock()
		s.stories = newStories
		s.sheetsLock.Unlock()

		fmt.Println("story changes received from firestore")

	}
}

// GetSheetsService authenticates to sheets api. panic on failure
func GetSheetsService(ctx context.Context) *sheets.Service {
	// TODO: possible change scopes
	// Alternatives::
	//     sheets.DriveScope
	//     sheets.DriveFileScope
	//     sheets.DriveReadonlyScope
	//     sheets.SpreadsheetsScope
	client, err := google.DefaultClient(ctx, sheets.SpreadsheetsScope)
	if err != nil {
		log.Fatal("failed to create api client", err.Error())
	}

	service, err := sheets.New(client)
	if err != nil {
		log.Fatal("failed to create sheets service", err.Error())
	}

	return service
}

// GetFirestoreClient authenticates firestore client. panic on failure
func GetFirestoreClient(ctx context.Context) *firestore.Client {

	projectID := os.Getenv("GCP_PROJECT")
	if projectID == "" {
		projectID = "whodo-app"
	}
	client, err := firestore.NewClient(ctx, projectID)
	if err != nil {
		log.Fatal("failed to create firestore client", err.Error())
	}

	return client
}
