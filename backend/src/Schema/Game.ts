import { UserDetails } from "./User";
import * as firebase from "firebase/app";
import { StoryMetadata, CharacterStory, Clue, Character } from "./Story";

export const GAME_COLLECTION = "games";
export const PLAYERVIEW_COLLECTION = "playerviews";

export interface GameState {
  Name: string;
  OwnerID: string;
  UserIDs: string[];
  Users: UserDetails[];

  CurrentRound: number;

  StartTime: Date;

  Guesses: Guess[];

  // store all clues for immediate reveal (not sensitive)
  DiscoveredClues: string[];

  StoryMetadata: StoryMetadata | null;

  FinishedAnswers: boolean;

  FinishedRounds: FinishedRound[];
  ReadyToStart: string[];
  ReadyForAnswer: string[];

  CharacterPicks: CharacterPick[];
  Characters: Character[];
  Clues: Clue[];
}

export interface CharacterPick {
  ParticipantID: string;
  CharacterName: string;
}

export interface Guess {
  ParticipantID: string;
  Killer: string;
  Why: string;
}

export interface FinishedRound {
  ParticipantID: string;
  Round: number;
  Finished: boolean;
}

export interface PlayerView {
  UserID: string;
  GameID: string;
  CharacterStory: CharacterStory | null;
  Notes: Note[];
  CluesSeen: string[];
  ReadRules: boolean;
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
