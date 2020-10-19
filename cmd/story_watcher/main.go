package main

import (
	"context"
	"time"

	"github.com/brensch/whodo/pkg/storysyncer"
)

func main() {
	ctx := context.Background()

	s := storysyncer.InitServer(ctx)

	for {
		s.SyncAllStories()
		time.Sleep(10 * time.Second)
	}

}
