import { UserDetails } from "./User";
import * as firebase from "firebase/app";
import { StorySummary, CharacterStory, Clue, Answer } from "./Story";

export const GAME_COLLECTION = "games";
export const PLAYERVIEW_COLLECTION = "playerviews";
export const POPULATE_INFO_REQUESTS = "populate_info_requests";
export const REVEAL_ANSWER_REQUESTS = "reveal_answer_requests";

export interface GameState {
  Name: string;
  OwnerID: string;
  UserIDs: string[];
  Users: UserDetails[];

  SelectedStory: StorySummary | null;
  StartTime: firebase.firestore.Timestamp;
  CharacterPicks: CharacterPick[];
  Locked: boolean;

  Clues: Clue[];
  Guesses: Guess[];
  Answers: Answer[];
  CurrentRound: number;
  FinishedAnswers: boolean;
  FinishedRounds: FinishedRound[];
  ReadyToStart: string[];
  ReadyForAnswer: string[];
}

type PopulateInfoRequestState =
  | "picking"
  | "havePicked"
  | "synced"
  | "changedMind";

export interface PopulateInfoRequest {
  State: PopulateInfoRequestState;
}

export interface RevealAnswerRequest {
  AnswerNumbers: number[];
}

export interface CharacterPick {
  UserID: string;
  CharacterName: string;
}

export interface Guess {
  UserID: string;
  Killer: string;
  How: string;
  Why: string;
}

export interface FinishedRound {
  UserID: string;
  Round: number;
}

export interface PlayerView {
  ID: string;
  UserID: string;
  GameID: string;
  CharacterStory: CharacterStory | null;
  Notes: Note[];
  CluesSeen: string[];
  ReadRules: boolean;
  ReadAnswer: boolean;
}

export interface AnswerRead {
  UserID: string;
  GameID: string;
}

export interface Note {
  AboutCharacter: string;
  Message: string;
  Round: number;
  Time: firebase.firestore.Timestamp;
}
