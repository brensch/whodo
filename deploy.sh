gcloud functions deploy HelloCool \
  --runtime go113 \
  --trigger-event providers/cloud.firestore/eventTypes/document.write \
  --trigger-resource "projects/whodo-app/databases/(default)/documents/stories2/{story}" \
  --source cmd/stories/