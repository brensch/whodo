import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Story } from "./Schema/Story";
import { ReadStoryFromSheet } from "./Sheets";

admin.initializeApp();

const db = admin.firestore();

export const watchStories = functions.firestore
  .document("stories2/{docID}")
  .onWrite((change, context) => {
    const storyAfter = change.after.data() as Story;
    return ReadStoryFromSheet(storyAfter.SheetID)
      .then((res) => {
        if (res instanceof Error) {
          throw Error;
        }

        return db.collection("stories2").doc(change.after.id).set(res);
      })
      .catch((err) =>
        db
          .collection("stories2")
          .doc(change.after.id)
          .update({ sync_error: err.toString() }),
      );
  });
