import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
  CharacterStory,
  Story,
  STORY_COLLECTION,
  STORY_SUMMARY_COLLECTION,
  InfoState,
} from "./Schema/Story";
import {
  GAME_COLLECTION,
  PopulateInfoRequest,
  POPULATE_INFO_REQUESTS,
  GameState,
  PLAYERVIEW_COLLECTION,
  PlayerView,
  REVEAL_ANSWER_REQUESTS,
  RevealAnswerRequest,
} from "./Schema/Game";
import { ReadStoryFromSheet, SummariseStory } from "./Sheets";

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

        res.ID = change.after.id;

        const batch = db.batch();

        const storyDoc = db.collection(STORY_COLLECTION).doc(change.after.id);
        batch.set(storyDoc, res);

        const storySummary = SummariseStory(res, change.after.id);

        const summaryDoc = db
          .collection(STORY_SUMMARY_COLLECTION)
          .doc(change.after.id);
        batch.set(summaryDoc, storySummary);

        return batch.commit();
      })
      .catch((err) =>
        db
          .collection(STORY_COLLECTION)
          .doc(change.after.id)
          .update({ SyncError: err.toString() }),
      );
  });

const JoinCharactersWithUsers = async (gameID: string) => {
  console.log("running transaction");
  const gameStateDoc = await db.collection(GAME_COLLECTION).doc(gameID).get();

  // .then((gameStateDoc) => {
  const gameState = gameStateDoc.data() as GameState;

  console.log("gameState", gameState);

  if (gameState.SelectedStory === null) {
    return;
  }

  // get story
  const storyDoc = await db
    .collection(STORY_COLLECTION)
    .doc(gameState.SelectedStory.ID)
    .get();

  const story = storyDoc.data() as Story;
  // get the character this player picked and add it to their playerview
  const playerViewsQueries = await Promise.all(
    gameState.UserIDs.map((userID) =>
      db
        .collection(PLAYERVIEW_COLLECTION)
        .where("UserID", "==", userID)
        .where("GameID", "==", gameID)
        .get(),
    ),
  );

  const playerViewDocs: FirebaseFirestore.DocumentSnapshot[] = [];

  // get docs from playerViewQueries
  await playerViewsQueries.forEach((query) =>
    query.forEach((doc) => playerViewDocs.push(doc)),
  );

  console.log("playerViewDocs", playerViewDocs);

  const batch = db.batch();

  await playerViewDocs.forEach((viewDoc) => {
    const view = viewDoc.data() as PlayerView;

    console.log("view", view);
    // get character pick
    const characterPick = gameState.CharacterPicks.find(
      (pick) => pick.UserID === view.UserID,
    );
    if (characterPick === undefined) {
      console.log("could not find characterPick for user", view.UserID);
      return;
    }

    // get full character object from the character name
    const character = story.Characters.find(
      (character) => character.Name === characterPick.CharacterName,
    );
    if (character === undefined) {
      console.log(
        "could not find character for charactername",
        characterPick.CharacterName,
      );
      return;
    }

    // // answers
    // const answer = story.Answers.find(
    //   (answer) => answer.Character === character.Name,
    // );
    // if (answer === undefined) {
    //   console.log("could not find answer for character", character.Name);
    //   return;
    // }

    // info - set done to false on load
    const infoStates: InfoState[] = story.Info.filter(
      (info) => info.Character === character.Name,
    ).map((info, i) => ({
      Done: false,
      Sequence: i,
      ...info,
    }));

    // timeline events
    const timelineEvents = story.TimelineEvents.filter(
      (timelineEvent) => timelineEvent.Character === character.Name,
    );

    const clues = story.Clues.filter(
      (clue) => clue.CharacterName === character.Name,
    );

    const characterStory: CharacterStory = {
      InfoStates: infoStates,
      TimelineEvents: timelineEvents,
      CluesToReveal: clues,
      Character: character,
    };

    // update character story
    batch.update(viewDoc.ref, { CharacterStory: characterStory });
  });

  // update state to 'synced' as final update
  const populateInfoRequestDoc = db
    .collection(POPULATE_INFO_REQUESTS)
    .doc(gameID);

  const newPopulateInfoRequestState: PopulateInfoRequest = {
    State: "synced",
  };

  batch.update(populateInfoRequestDoc, newPopulateInfoRequestState);

  return batch.commit();
};

export const watchPopulateInfoRequest = functions.firestore
  .document(`${POPULATE_INFO_REQUESTS}/{docID}`)
  .onUpdate((change, context) => {
    const requestAfter = change.after.data() as PopulateInfoRequest;

    if (requestAfter.State === "havePicked") {
      JoinCharactersWithUsers(change.after.id).catch(console.log);
    }

    return;
  });

export const watchRevealAnswerRequests = functions.firestore
  .document(`${REVEAL_ANSWER_REQUESTS}/{docID}`)
  .onWrite(async (change, context) => {
    const requestAfter = change.after.data() as RevealAnswerRequest;

    const gameRef = db.collection(GAME_COLLECTION).doc(change.after.id);
    const gameDoc = await gameRef.get();
    const gameState = gameDoc.data() as GameState;

    if (gameState.SelectedStory === null) {
      console.log("no selected story for game", change.after.id);
    }

    const storyDoc = await db
      .collection(STORY_COLLECTION)
      .doc(gameState.SelectedStory!.ID)
      .get();

    const story = storyDoc.data() as Story;

    console.log(story);

    // check if all answers have been read
    if (requestAfter.AnswerNumbers.length > story.Answers.length) {
      return await gameRef.update({
        FinishedAnswers: true,
        "SelectedStory.Metadata.Conclusion": story.Metadata.Conclusion,
      });
    }

    const answers = requestAfter.AnswerNumbers.map(
      (number) => story.Answers[number],
    );

    return await gameRef.update({
      Answers: answers,
    });
  });

// export const watchPopulateInfoRequest = functions.firestore
// .document(`${POPULATE_INFO_REQUESTS}/{docID}`)
// .onUpdate((change, context) => {
//   const requestAfter = change.after.data() as PopulateInfoRequest;

//   if (requestAfter.State === "havePicked") {
//     const batch = db.batch();

//     console.log("running transaction");
//     db.collection(GAME_COLLECTION)
//       .doc(change.after.id)
//       .get()
//       .then((gameStateDoc) => {
//         const gameState = gameStateDoc.data() as GameState;

//         if (gameState.SelectedStory === null) {
//           return;
//         }

//         // get story
//         return db
//           .collection(STORY_COLLECTION)
//           .doc(gameState.SelectedStory.ID)
//           .get()
//           .then((storyDoc) => {
//             const story = storyDoc.data() as Story;
//             // get the character this player picked and add it to their playerview
//             return gameState.UserIDs.forEach((userID) =>
//               db
//                 .collection(PLAYERVIEW_COLLECTION)
//                 .where("UserID", "==", userID)
//                 .where("GameID", "==", change.after.id)
//                 .get()
//                 .then((snap) =>
//                   // match the character to the story, then populate their PlayerView
//                   snap.forEach((doc) => {
//                     // get character this user chose
//                     const characterPick = gameState.CharacterPicks.find(
//                       (pick) => pick.UserID === userID,
//                     );
//                     if (characterPick === undefined) {
//                       console.log(
//                         "could not find characterPick for user",
//                         userID,
//                       );
//                       return;
//                     }

//                     // get full character object from the character name
//                     const character = gameState.Characters.find(
//                       (character) =>
//                         character.Name === characterPick.CharacterName,
//                     );
//                     if (character === undefined) {
//                       console.log(
//                         "could not find character for charactername",
//                         characterPick.CharacterName,
//                       );
//                       return;
//                     }

//                     // answers
//                     const answer = story.Answers.find(
//                       (answer) => answer.Character === character.Name,
//                     );
//                     if (answer === undefined) {
//                       console.log(
//                         "could not find answer for character",
//                         character.Name,
//                       );
//                       return;
//                     }

//                     // info - set done to false on load
//                     const infoStates = story.Info.filter(
//                       (info) => info.Character === character.Name,
//                     ).map((info) => ({
//                       Done: false,
//                       ...info,
//                     }));

//                     // timeline events
//                     const timelineEvents = story.TimelineEvents.filter(
//                       (timelineEvent) =>
//                         timelineEvent.Character === character.Name,
//                     );

//                     const clues = story.Clues.filter(
//                       (clue) => clue.CharacterName === character.Name,
//                     );

//                     const characterStory: CharacterStory = {
//                       Answer: answer,
//                       InfoStates: infoStates,
//                       TimelineEvents: timelineEvents,
//                       CluesToReveal: clues,
//                       Character: character,
//                     };
//                     batch.update(doc.ref, { CharacterStory: characterStory });
//                   }),
//                 ),
//             );
//           })
//           .then(() => {
//             batch.update;
//           });
//       });

//     // const playerViewsQuery = db
//     //   .collection(GAME_COLLECTION)
//     //   .where("GameID", "==", change.after.id);

//     // db.runTransaction((t) => {
//     //   return t.get(gameStateDoc).then((doc) => {
//     //     const gameState = doc.data() as GameState;

//     //     // map each user's playerview to a doc for the transaction
//     //     const playerViewQueries = gameState.UserIDs.map((userID) =>
//     //       db
//     //         .collection(PLAYERVIEW_COLLECTION)
//     //         .where("UserID", "==", userID)
//     //         .where("GameID", "==", change.after.id)
//     //     );

//     //     // const

//     //     const playerViewDocs = playerViewQueries.map(query => query.get().then(snap =>
//     //       snap.docs.map(doc => doc.ref)
//     //     ))

//     //     console.log(gameState);
//     //     if (gameState.SelectedStory === null) {
//     //       return;
//     //     }
//     //     // use gamestate to get story from selectedstory ID
//     //     const storyDoc = db
//     //       .collection(STORY_COLLECTION)
//     //       .doc(gameState.SelectedStory.ID);
//     //     return t.get(storyDoc).then((doc) => {
//     //       const story = doc.data() as Story;
//     //       console.log("story:", story);
//     //       console.log("request after:", requestAfter);
//     //       playerViewDocs.forEach((doc) =>
//     //           t.update(doc, {})),
//     //       );

//     //       // t.update;
//     //     });
//     //   });
//     // });
//   }

//   return;
// });
