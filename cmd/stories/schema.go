package stories

import (
	"time"

	"github.com/brensch/whodo/pkg/storysyncer"
)

type FirestoreEvent struct {
	OldValue   FirestoreValue `json:"oldValue"`
	Value      FirestoreValue `json:"value"`
	UpdateMask struct {
		FieldPaths []string `json:"fieldPaths"`
	} `json:"updateMask"`
}

type FirestoreValue struct {
	CreateTime time.Time         `json:"createTime"`
	Name       string            `json:"name"`
	UpdateTime time.Time         `json:"updateTime"`
	Fields     storysyncer.Story `json:"fields"`
}
