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
  const gameStateRef = db.collection(GAME_COLLECTION).doc(gameID);
  const gameStateDoc = await gameStateRef.get();

  // .then((gameStateDoc) => {
  const gameState = gameStateDoc.data() as GameState;

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

  const batch = db.batch();

  await playerViewDocs.forEach((viewDoc) => {
    const view = viewDoc.data() as PlayerView;

    // get character pick
    const characterPick = gameState.CharacterPicks.find(
      (pick) => pick.UserID === view.UserID,
    );
    if (characterPick === undefined) {
      return;
    }

    // get full character object from the character name
    const character = story.Characters.find(
      (character) => character.Name === characterPick.CharacterName,
    );
    if (character === undefined) {
      console.log(
        "character in pick is not defined",
        characterPick.CharacterName,
      );
      return;
    }

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

  // update state to 'synced'
  const populateInfoRequestRef = db
    .collection(POPULATE_INFO_REQUESTS)
    .doc(gameID);
  const newPopulateInfoRequestState: PopulateInfoRequest = {
    State: "synced",
  };
  batch.update(populateInfoRequestRef, newPopulateInfoRequestState);

  // set state to locked to prevent any further players joining
  batch.update(gameStateRef, {
    Locked: true,
  });

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
