export class Story {
  ID: string = "new_instance";
  Name: string = "";
  Conclusion: string = "";
  Rounds: Array<Round> = [];
  Clues: Array<Clue> = [];
  Characters: Array<Character> = [];
  Blurb: string = "";
}

export class Clue {
  constructor(
    public CharacterName: CharacterName,
    public Description: string,
    public ClueName: string,
    public RoundNumber: number,
    public Url: URL,
  ) {}
}

export class Round {
  constructor(public Intro: string, public Name: string) {}
}

export type CharacterName = string;

export class Character {
  constructor(
    public Blurb: string,
    public Info: Array<RoundInfo>,
    public Name: CharacterName,
  ) {}
}

export class RoundInfo {
  constructor(public Public: Array<Info>, public Private: Array<Info>) {}
}

export type Info = string;
