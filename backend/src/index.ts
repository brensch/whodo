import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
  Story,
  STORY_COLLECTION,
  STORY_METADATA_COLLECTION,
} from "./Schema/Story";
import { ReadStoryFromSheet } from "./Sheets";

admin.initializeApp();

const db = admin.firestore();

export const watchStories = functions.firestore
  .document(`${STORY_COLLECTION}/{docID}`)
  .onWrite((change, context) => {
    const storyAfter = change.after.data() as Story;
    return ReadStoryFromSheet(storyAfter.SheetID)
      .then((res) => {
        if (res instanceof Error) {
          throw Error;
        }

        const batch = db.batch();

        const storyDoc = db.collection(STORY_COLLECTION).doc(change.after.id);
        batch.set(storyDoc, res);

        const metadataDoc = db
          .collection(STORY_METADATA_COLLECTION)
          .doc(change.after.id);
        batch.set(metadataDoc, res.Metadata);

        return batch.commit();
      })
      .catch((err) =>
        db
          .collection(STORY_COLLECTION)
          .doc(change.after.id)
          .update({ sync_error: err.toString() }),
      );
  });
