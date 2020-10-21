package stories

import "time"

// https://github.com/googleapis/google-cloud-go/issues/1438
type FirestoreEvent struct {
	OldValue   FirestoreEvent `json:"oldValue"`
	Value      FirestoreEvent `json:"value"`
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
