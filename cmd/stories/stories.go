package stories

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/brensch/whodo/pkg/cloudfunctions"
	"github.com/brensch/whodo/pkg/storysyncer"
)

// this service is intended to run as a cloud function, so global state is how to handle clients
var (
	storyServer *storysyncer.Server
)

func init() {
	storyServer = storysyncer.InitServer(context.Background())
}

func HelloCool(ctx context.Context, e cloudfunctions.FirestoreEvent) (err error) {
	fullPath := strings.Split(e.Value.Name, "/documents/")[1]
	pathParts := strings.Split(fullPath, "/")
	collection := pathParts[0]
	doc := strings.Join(pathParts[1:], "/")

	eventJSON, err := json.Marshal(e)
	if err != nil {
		return
	}

	fmt.Println("doc:", doc)
	fmt.Println("collection:", collection)
	fmt.Println("event:", string(eventJSON))
	return

	// curValue := e.Value.Fields.Original.StringValue
	// newValue := strings.ToUpper(curValue)
	// if curValue == newValue {
	// 	log.Printf("%q is already upper case: skipping", curValue)
	// 	return nil
	// }
	// log.Printf("Replacing value: %q -> %q", curValue, newValue)

	// data := map[string]string{"original": newValue}
	// _, err := storyServer.FirestoreClient.Collection(collection).Doc(doc).Set(ctx, data)
	// if err != nil {
	// 	return fmt.Errorf("Set: %v", err)
	// }
	// return nil
}