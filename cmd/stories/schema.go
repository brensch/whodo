package stories

import (
	"time"
)

type FirestoreEvent struct {
	OldValue   FirestoreValue `json:"oldValue"`
	Value      FirestoreValue `json:"value"`
	UpdateMask struct {
		FieldPaths []string `json:"fieldPaths"`
	} `json:"updateMask"`
}

type FirestoreValue struct {
	CreateTime time.Time   `json:"createTime"`
	Name       string      `json:"name"`
	UpdateTime time.Time   `json:"updateTime"`
	Fields     interface{} `json:"fields"`
}
