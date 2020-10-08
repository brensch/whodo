export class Story {
  constructor(
    public Name: string,
    public Conclusion: string,
    public Rounds: Array<Round>,
    public Clues: Array<Clue>
  ) {}
}

export class Clue {
  constructor(
    public CharacterName: CharacterName,
    public Description: string,
    public ClueName: string,
    public RoundNumber: number,
    public Url: URL
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
    public Name: CharacterName
  ) {}
}

export class RoundInfo {
  constructor(public Public: Array<Info>, public Private: Array<Info>) {}
}

export type Info = string;
