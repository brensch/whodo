export interface Story {
  Metadata: Metadata;
  Answers: Answer[];
  Rounds: Round[];
  Info: Info[];
  // ID: string;
  SheetID: string;
  TimelineEvents: TimelineEvent[];
  Clues: Clue[];
  Characters: Character[];
  SyncError: Error | null;
}

export interface Metadata {
  Conclusion: string;
  Name: string;
  Blurb: string;
}

export interface Answer {
  Character: string;
  Details: string;
}

export interface Character {
  Name: string;
  Blurb: string;
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

export interface Round {
  Name: string;
  Intro: string;
}

export interface TimelineEvent {
  Time: string;
  Event: string;
  Character: string;
}
