package stories

import (
	"context"
	"encoding/json"
	"log"
	"strings"

	"github.com/brensch/whodo/pkg/storysyncer"
)

// this service is intended to run as a cloud function, so global state is how to handle clients
var (
	storyServer *storysyncer.Server
)

func init() {
	storyServer = storysyncer.InitServer(context.Background())
}

func HelloCool(ctx context.Context, e FirestoreEvent) (err error) {
	fullPath := strings.Split(e.Value.Name, "/documents/")[1]
	pathParts := strings.Split(fullPath, "/")
	collection := pathParts[0]
	doc := strings.Join(pathParts[1:], "/")

	eventJSON, err := json.Marshal(e)
	if err != nil {
		return
	}

	// ds, err := storyServer.FirestoreClient.NewDocumentSnapshot(e.Value)

	log.Println(e.OldValue.Fields)

	log.Println("doc:", doc)
	log.Println("collection:", collection)
	log.Println("event:", string(eventJSON))

	storyServer.FirestoreClient.Collection(storysyncer.StoriesCollection).Doc(doc)
	return

}
