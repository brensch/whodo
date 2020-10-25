import {
  GameState,
  GAME_COLLECTION,
  PlayerView,
  PLAYERVIEW_COLLECTION,
} from "../Schema/Game";
import { UserDetails, USER_COLLECTION } from "../Schema/User";
import { db } from "../Firebase";
import * as firebase from "firebase/app";
import {
  StoryMetadata,
  SELECTEDSTORY_COLLECTION,
  SelectedStory,
} from "../Schema/Story";

export const ConnectGameState = (
  id: string,
  set: React.Dispatch<React.SetStateAction<GameState | null>>,
) => {
  try {
    db.collection(GAME_COLLECTION)
      .doc(id)
      .onSnapshot((doc) => {
        // lose type safety here in case of incorrect DB data
        // TODO: add type checks at runtime
        set((doc as unknown) as GameState);
      });
  } catch (err) {
    throw err;
  }
};

export const CreateGame = (
  name: string,
  selectedDate: Date,
  userDetails: UserDetails,
) => {
  const newGameState: GameState = {
    Name: name,
    OwnerID: userDetails.ID,
    UserIDs: [],
    Users: [],
    Guesses: [],
    StartTime: selectedDate,
    DiscoveredClues: [],
    FinishedRounds: [],
    ReadyToStart: [],
    FinishedAnswers: false,
    ReadyForAnswer: [],

    CurrentRound: 0,
    CharacterPicks: [],
    Characters: [],
    StoryMetadata: null,
    Clues: [],
  };

  //   TODO: make this work if addusertogamefails
  return db
    .collection(GAME_COLLECTION)
    .add(newGameState)
    .then((addeddGame) => AddUserToGame(addeddGame.id, userDetails));
};

export const AddUserToGame = (gameID: string, userDetails: UserDetails) => {
  const gameDoc = db.collection(GAME_COLLECTION).doc(gameID);
  const userDoc = db.collection(USER_COLLECTION).doc(userDetails.ID);

  // doing updates as batch to ensure game gets added to user object as well
  var batch = db.batch();
  batch.update(gameDoc, {
    Users: firebase.firestore.FieldValue.arrayUnion(userDetails),
    ParticipantIDs: firebase.firestore.FieldValue.arrayUnion(userDetails.ID),
  });
  batch.update(userDoc, {
    Games: firebase.firestore.FieldValue.arrayUnion(gameID),
  });

  return batch.commit();
};

export const SetGameStory = (gameID: string, storyMetadata: StoryMetadata) => {
  const gameDoc = db.collection(GAME_COLLECTION).doc(gameID);
  const selectedStoryDoc = db.collection(SELECTEDSTORY_COLLECTION).doc(gameID);

  const selectedStory: SelectedStory = {
    Metadata: storyMetadata,
  };
  // doing updates as batch to ensure game gets added to user object as well
  var batch = db.batch();

  batch.update(gameDoc, {
    StoryMetadata: storyMetadata,
  });
  batch.set(selectedStoryDoc, {
    SelectedAt: firebase.firestore.FieldValue.serverTimestamp(),
    ...selectedStory,
  });

  return batch.commit();
};

export const ConnectPlayerView = (
  userDetails: UserDetails,
  gameID: string,
  set: React.Dispatch<React.SetStateAction<PlayerView | null>>,
) => {
  try {
    db.collection(PLAYERVIEW_COLLECTION)
      .where("UserID", "==", userDetails.ID)
      .where("GameID", "==", gameID)
      .onSnapshot((querySnapshot) => {
        if (querySnapshot.empty) {
          set(null);
          return;
        }

        const doc = querySnapshot.docs[0];
        // lose type safety here in case of incorrect DB data
        // TODO: add type checks at runtime
        set((doc as unknown) as PlayerView);
      });
  } catch (err) {
    throw err;
  }
};

export const CreateUserDetails = (id: string, email: string, name: string) => {
  const newUserDetails: UserDetails = {
    ID: id,
    Email: email,
    Name: name,
    Games: [],
  };

  return db.collection(USER_COLLECTION).add(newUserDetails);
};
