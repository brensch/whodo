import * as firebase from "firebase/app";
import { v4 as uuidv4 } from "uuid";
import { db } from "../Firebase";
import {
  CharacterPick,
  FinishedRound,
  GameState,
  GAME_COLLECTION,
  Guess,
  Note,
  PlayerView,
  PLAYERVIEW_COLLECTION,
  PopulateInfoRequest,
  POPULATE_INFO_REQUESTS,
  RevealAnswerRequest,
  REVEAL_ANSWER_REQUESTS,
} from "../Schema/Game";
import { Clue, InfoState, StorySummary } from "../Schema/Story";
import {
  UserDetails,
  UserGames,
  USER_DETAILS_COLLECTION,
  USER_GAMES_COLLECTION,
} from "../Schema/User";

const Slugify = (string: string) => {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word characters
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

export const ConnectGameState = (
  id: string,
  set: React.Dispatch<React.SetStateAction<GameState | null | undefined>>,
) =>
  db
    .collection(GAME_COLLECTION)
    .doc(id)
    .onSnapshot((doc) => {
      // lose type safety here in case of incorrect DB data
      // TODO: add type checks at runtime
      if (!doc.exists) {
        return set(undefined);
      }
      set((doc.data() as unknown) as GameState);
    });

export const ConnectPopulateInfoRequest = (
  id: string,
  set: React.Dispatch<
    React.SetStateAction<PopulateInfoRequest | null | undefined>
  >,
) =>
  db
    .collection(POPULATE_INFO_REQUESTS)
    .doc(id)
    .onSnapshot((doc) => {
      // lose type safety here in case of incorrect DB data
      // TODO: add type checks at runtime
      if (!doc.exists) {
        return set(undefined);
      }
      set((doc.data() as unknown) as PopulateInfoRequest);
    });

export const CreateGame = async (
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
    Answers: [],
    StartTime: firebase.firestore.Timestamp.fromDate(selectedDate),
    FinishedRounds: [],
    ReadyToStart: [],
    FinishedAnswers: false,
    ReadyForAnswer: [],
    CurrentRound: 0,
    CharacterPicks: [],
    SelectedStory: null,
    Clues: [],
    Locked: false,
  };

  var batch = db.batch();

  // update game
  const gameSlug = Slugify(name)
  // const gameID = uuidv4();
  const gameDoc = db.collection(GAME_COLLECTION).doc(gameSlug);

  // check if the game exists first, abort if it does
  const game = await gameDoc.get()
  if (game.exists) {
    throw(Error("that name is taken"))
  }

  batch.set(gameDoc, newGameState);

  // add game to user's list
  const userDoc = db.collection(USER_GAMES_COLLECTION).doc(userDetails.ID);
  batch.update(userDoc, {
    Games: firebase.firestore.FieldValue.arrayUnion(gameSlug),
  });

  // create populateinforequest
  const popInfoDoc = db.collection(POPULATE_INFO_REQUESTS).doc(gameSlug);
  const newPopInfo: PopulateInfoRequest = { State: "picking" };
  batch.set(popInfoDoc, newPopInfo);

  // create playerview
  const playerViewID = uuidv4();
  const playerViewDoc = db.collection(PLAYERVIEW_COLLECTION).doc(playerViewID);
  const newPlayerView: PlayerView = {
    ID: playerViewID,
    UserID: userDetails.ID,
    GameID: gameSlug,
    CharacterStory: null,
    Notes: [],
    CluesSeen: [],
    ReadRules: false,
    ReadAnswer: false,
  };
  batch.set(playerViewDoc, newPlayerView);

  return batch.commit().then(() => gameSlug);
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
    ID: playerViewID,
    UserID: userDetails.ID,
    GameID: gameID,
    CharacterStory: null,
    Notes: [],
    CluesSeen: [],
    ReadRules: false,
    ReadAnswer: false,
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
      return (doc.data() as unknown) as UserGames;
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

export const SetReadyToStart = (gameID: string, userID: string) => {
  return db
    .collection(GAME_COLLECTION)
    .doc(gameID)
    .update({
      ReadyToStart: firebase.firestore.FieldValue.arrayUnion(userID),
    });
};

export const SetReadRules = (playerViewID: string, read: boolean) => {
  return db.collection(PLAYERVIEW_COLLECTION).doc(playerViewID).update({
    ReadRules: read,
  });
};

// taking in entire infoarray instead of removing single info then adding it back to preserve order
export const ToggleInfoDone = (
  playerViewID: string,
  infoArray: InfoState[],
  indexToToggle: number,
) => {
  infoArray[indexToToggle].Done = !infoArray[indexToToggle].Done;

  return db.collection(PLAYERVIEW_COLLECTION).doc(playerViewID).update({
    "CharacterStory.InfoStates": infoArray,
  });
};

export const DiscoverClue = (gameID: string, clue: Clue) => {
  return db
    .collection(GAME_COLLECTION)
    .doc(gameID)
    .update({
      Clues: firebase.firestore.FieldValue.arrayUnion(clue),
    });
};

export const SetFinishedRound = (
  gameID: string,
  round: number,
  userID: string,
) => {
  const finishedRound: FinishedRound = {
    Round: round,
    UserID: userID,
  };
  return db
    .collection(GAME_COLLECTION)
    .doc(gameID)
    .update({
      FinishedRounds: firebase.firestore.FieldValue.arrayUnion(finishedRound),
    });
};

export const SetUnfinishedRound = (
  gameID: string,
  round: number,
  userID: string,
) => {
  const finishedRound: FinishedRound = {
    Round: round,
    UserID: userID,
  };
  return db
    .collection(GAME_COLLECTION)
    .doc(gameID)
    .update({
      FinishedRounds: firebase.firestore.FieldValue.arrayRemove(finishedRound),
    });
};

export const SetRound = (gameID: string, round: number) => {
  return db.collection(GAME_COLLECTION).doc(gameID).update({
    CurrentRound: round,
  });
};

export const TakeNote = (
  playerViewID: string,
  round: number,
  subject: string,
  message: string,
) => {
  const newNote: Note = {
    AboutCharacter: subject,
    Message: message,
    Round: round,
    Time: firebase.firestore.Timestamp.fromDate(new Date()),
  };
  return db
    .collection(PLAYERVIEW_COLLECTION)
    .doc(playerViewID)
    .update({
      Notes: firebase.firestore.FieldValue.arrayUnion(newNote),
    });
};

export const SubmitGuess = (
  gameID: string,
  userID: string,
  killer: string,
  how: string,
  why: string,
) => {
  const guess: Guess = {
    UserID: userID,
    Killer: killer,
    How: how,
    Why: why,
  };
  return db
    .collection(GAME_COLLECTION)
    .doc(gameID)
    .update({
      Guesses: firebase.firestore.FieldValue.arrayUnion(guess),
    });
};

export const SubmitReadyForAnswer = (gameID: string, userID: string) => {
  return db
    .collection(GAME_COLLECTION)
    .doc(gameID)
    .update({
      ReadyForAnswer: firebase.firestore.FieldValue.arrayUnion(userID),
    });
};

export const RequestNextAnswer = (
  gameID: string,
  playerViewID: string,
  number: number,
) => {
  const gameRef = db.collection(REVEAL_ANSWER_REQUESTS).doc(gameID);

  // this function is also used to trigger the very first clue by all clients
  if (number === 0) {
    const newRequest: RevealAnswerRequest = {
      AnswerNumbers: [0],
    };
    return gameRef.set(newRequest);
  }

  const batch = db.batch();

  const playerViewRef = db.collection(PLAYERVIEW_COLLECTION).doc(playerViewID);

  batch.update(playerViewRef, {
    ReadAnswer: true,
  });

  batch.update(gameRef, {
    AnswerNumbers: firebase.firestore.FieldValue.arrayUnion(number),
  });

  return batch.commit();
};

export const RevealClue = (gameID: string, clue: Clue) => {
  return db
    .collection(GAME_COLLECTION)
    .doc(gameID)
    .update({
      Clues: firebase.firestore.FieldValue.arrayUnion(clue),
    });
};

export const MarkClueSeen = (playerViewID: string, clue: Clue) => {
  return db
    .collection(PLAYERVIEW_COLLECTION)
    .doc(playerViewID)
    .update({
      CluesSeen: firebase.firestore.FieldValue.arrayUnion(clue.Name),
    });
};
