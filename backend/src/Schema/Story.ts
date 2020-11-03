export const STORY_COLLECTION = "stories";
export const STORY_SUMMARY_COLLECTION = "storysummaries";

export interface Story {
  ID: string | null;
  Metadata: StoryMetadata;
  Answers: Answer[];
  Rounds: Round[];
  Info: Info[];
  SheetID: string;
  TimelineEvents: TimelineEvent[];
  Clues: Clue[];
  Characters: Character[];
  SyncError: Error | null;
}

export interface StorySummary {
  ID: string;
  Characters: Character[];
  Rounds: Round[];
  Metadata: StoryMetadata;
}

export interface CharacterStory {
  InfoStates: InfoState[];
  TimelineEvents: TimelineEvent[];
  CluesToReveal: Clue[];
  Character: Character;
}

// Conclusion is null in summary until set by function
export interface StoryMetadata {
  Conclusion: string | null;
  Name: string;
  Blurb: string;
}

export interface Answer {
  Number: number;
  Character: string;
  Details: string;
}

export interface Character {
  Name: string;
  Description: string;
  Blurb: string;
  Age: number;
  Costume: string;
  Accessories: string;
}

export interface Clue {
  CharacterName: string;
  Round: string;
  URL: string;
  Name: string;
  Description: string;
}

export interface Info {
  Round: string;
  Character: string;
  Public: boolean;
  Content: string;
}

export interface InfoState extends Info {
  Done: boolean;
  Sequence: number;
}

export interface Round {
  Name: string;
  Intro: string;
}

export interface TimelineEvent {
  Time: string;
  Event: string;
  Character: string;
}

// used to trigger update of all playerviews
// export interface SelectedStory {
//   SelectedAt?: firebase.firestore.Timestamp;
//   Metadata: StoryMetadata;
// }
