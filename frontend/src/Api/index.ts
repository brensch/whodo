import {
  CharacterPick,
  GameState,
  GAME_COLLECTION,
  PlayerView,
  PLAYERVIEW_COLLECTION,
  POPULATE_INFO_REQUESTS,
  PopulateInfoRequest,
} from "../Schema/Game";
import {
  UserDetails,
  UserGames,
  USER_DETAILS_COLLECTION,
  USER_GAMES_COLLECTION,
} from "../Schema/User";
import { db } from "../Firebase";
import * as firebase from "firebase/app";
import { StoryMetadata, StorySummary } from "../Schema/Story";
import { v4 as uuidv4 } from "uuid";

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
        set((doc.data() as unknown) as GameState);
      });
  } catch (err) {
    throw err;
  }
};

export const ConnectPopulateInfoRequest = (
  id: string,
  set: React.Dispatch<React.SetStateAction<PopulateInfoRequest | null>>,
) => {
  try {
    db.collection(POPULATE_INFO_REQUESTS)
      .doc(id)
      .onSnapshot((doc) => {
        // lose type safety here in case of incorrect DB data
        // TODO: add type checks at runtime
        set((doc.data() as unknown) as PopulateInfoRequest);
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
    UserIDs: [userDetails.ID],
    Users: [userDetails],
    Guesses: [],
    StartTime: selectedDate,
    DiscoveredClues: [],
    FinishedRounds: [],
    ReadyToStart: [],
    FinishedAnswers: false,
    ReadyForAnswer: [],

    CurrentRound: 0,
    CharacterPicks: [],
    SelectedStory: null,
    Clues: [],
  };

  var batch = db.batch();

  // update game
  const gameID = uuidv4();
  const gameDoc = db.collection(GAME_COLLECTION).doc(gameID);
  batch.set(gameDoc, newGameState);

  // add game to user's list
  const userDoc = db.collection(USER_GAMES_COLLECTION).doc(userDetails.ID);
  batch.update(userDoc, {
    Games: firebase.firestore.FieldValue.arrayUnion(gameID),
  });

  // create populateinforequest
  const popInfoDoc = db.collection(POPULATE_INFO_REQUESTS).doc(gameID);
  const newPopInfo: PopulateInfoRequest = { State: "picking" };
  batch.set(popInfoDoc, newPopInfo);

  // create playerview
  const playerViewID = uuidv4();
  const playerViewDoc = db.collection(PLAYERVIEW_COLLECTION).doc(playerViewID);
  const newPlayerView: PlayerView = {
    UserID: userDetails.ID,
    GameID: gameID,
    CharacterStory: null,
    Notes: [],
    CluesSeen: [],
    ReadRules: false,
  };
  batch.set(playerViewDoc, newPlayerView);

  return batch.commit().then(() => gameID);
};

export const RequestInfoPopulation = (gameID: string) => {
  const newState: PopulateInfoRequest = {
    State: "havePicked",
  };
  return db.collection(POPULATE_INFO_REQUESTS).doc(gameID).update(newState);
};

export const AddUserToGame = (gameID: string, userDetails: UserDetails) => {
  // doing updates as batch to ensure game gets added to user object as well
  var batch = db.batch();

  // add user to users and userIDs
  const gameDoc = db.collection(GAME_COLLECTION).doc(gameID);
  batch.update(gameDoc, {
    Users: firebase.firestore.FieldValue.arrayUnion(userDetails),
    UserIDs: firebase.firestore.FieldValue.arrayUnion(userDetails.ID),
  });

  // add this game to list of games for player
  const userDoc = db.collection(USER_GAMES_COLLECTION).doc(userDetails.ID);
  batch.update(userDoc, {
    Games: firebase.firestore.FieldValue.arrayUnion(gameID),
  });

  // create playerview
  const playerViewID = uuidv4();
  const playerViewDoc = db.collection(PLAYERVIEW_COLLECTION).doc(playerViewID);
  const newPlayerView: PlayerView = {
    UserID: userDetails.ID,
    GameID: gameID,
    CharacterStory: null,
    Notes: [],
    CluesSeen: [],
    ReadRules: false,
  };
  batch.set(playerViewDoc, newPlayerView);

  return batch.commit();
};

export const SetGameStory = (
  gameID: string,
  storySummary: StorySummary | null,
) => {
  const gameDoc = db.collection(GAME_COLLECTION).doc(gameID);

  var updateObject: any = {
    SelectedStory: storySummary,
  };

  if (storySummary === null) {
    updateObject.CharacterPicks = [];
  }

  return gameDoc.update(updateObject);
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
        set((doc.data() as unknown) as PlayerView);
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
  };

  const newUserGames: UserGames = {
    Games: [],
  };

  const userDetailsDoc = db.collection(USER_DETAILS_COLLECTION).doc(id);
  const userGamesDoc = db.collection(USER_GAMES_COLLECTION).doc(id);

  var batch = db.batch();

  batch.set(userDetailsDoc, newUserDetails);
  batch.set(userGamesDoc, newUserGames);

  return batch.commit();
};

export const GetUserGames = (id: string) => {
  return db
    .collection(USER_GAMES_COLLECTION)
    .doc(id)
    .get()
    .then((doc) => {
      return (doc as unknown) as UserGames;
    });
};

export const PickCharacter = (
  gameID: string,
  userID: string,
  characterName: string,
) => {
  const characterPick: CharacterPick = {
    UserID: userID,
    CharacterName: characterName,
  };

  return db
    .collection(GAME_COLLECTION)
    .doc(gameID)
    .update({
      CharacterPicks: firebase.firestore.FieldValue.arrayUnion(characterPick),
    });
};
