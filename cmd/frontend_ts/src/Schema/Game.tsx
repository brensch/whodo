import { UserDetails } from "./User";
import { Character, CharacterName, Story } from "./Story";
import { db } from "../Firebase";

const GAME_COLLECTION = "games";

export class Game {
  ID?: string;
  Name?: string;
  CurrentAnswer: number = 0;
  CurrentRound: number = 0;
  DiscoveredClues: Array<number> = [];
  ParticipantIDs: Array<string> = [];
  Participants: Array<Participant> = [];

  addToFirestore(name: string) {
    this.Name = name;
    console.log(`adding ${name}`);
  }

  addParticipant(user: UserDetails) {
    const newParticipant = new Participant(user);
    this.Participants.push(newParticipant);
    console.log(`adding participant ${newParticipant.User.ID}`);
  }

  connect(id: string, set: React.Dispatch<React.SetStateAction<Game | null>>) {
    this.ID = id;
    return db
      .collection(GAME_COLLECTION)
      .doc(id)
      .onSnapshot((snapshot) => {
        const receivedGame = snapshot.data() as Game;
        set(receivedGame);
      });
  }
}

// const unsub = db
//   .collection("games")
//   .doc(id)
//   .onSnapshot((snapshot) => {
//     const receivedGame = snapshot.data() as Game;
//     console.log(receivedGame);
//     console.log(receivedGame.CurrentRound);

//     setGame(receivedGame);
//   });
// return () => {
//   unsub();
// };

export class Participant {
  User: UserDetails;
  RoundStates: Array<RoundState> = [];
  Notes: Array<Note> = [];
  ReadRules: boolean = false;
  ReadyForAnswer: boolean = false;
  ReadyToStart: boolean = false;
  SeenClues: Array<number> = [];
  Guess: Guess | null = null;

  constructor(User: UserDetails) {
    this.User = User;
  }
}

export class Guess {
  constructor(public Killer: CharacterName, public Why: string) {}
}

export class RoundState {
  constructor(
    public Private: Array<boolean>,
    public Public: Array<boolean>,
    public Ready: boolean
  ) {}
}

export class Note {
  constructor(
    public Message: string,
    public Round: number,
    public Subject: CharacterName | null
  ) {}
}
