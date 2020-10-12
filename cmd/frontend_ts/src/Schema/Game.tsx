import { UserDetails } from "./User";
import { Character, CharacterName, Story } from "./Story";
import { db } from "../Firebase";
import * as firebase from "firebase/app";

const GAME_COLLECTION = "games";

export class Game {
  ID?: string;
  Name?: string;
  OwnerID: string;
  ParticipantIDs: Array<string> = [];
  Participants: Array<Participant> = [];

  CurrentAnswer = 0;
  CurrentRound = 0;
  ParticipantsLocked = false;
  DiscoveredClues: Array<number> = [];

  Story: Story | null = null;

  StartTime: firebase.firestore.Timestamp = firebase.firestore.Timestamp.fromDate(
    new Date()
  );

  constructor(user: UserDetails) {
    this.ParticipantIDs = [user.ID];
    this.OwnerID = user.ID;
    const participant = new Participant(user);
    this.Participants = [participant];
  }

  addToFirestore(name: string, startTime: Date) {
    this.Name = name;
    this.StartTime = firebase.firestore.Timestamp.fromDate(startTime);

    // this feels dirty, but not as dirty as the fact that the firestore arbitrarily blocks
    // custom objects just because they can't guarantee they'll stay typesafe
    return db.collection(GAME_COLLECTION).add(JSON.parse(JSON.stringify(this)));
  }

  addParticipant(user: UserDetails) {
    if (user.ID in this.ParticipantIDs) {
      throw "user already in game";
    }
    const newParticipant = new Participant(user);
    // this.Participants.push(newParticipant);
    console.log(`adding participant ${newParticipant.User.ID}`);
    return db
      .collection(GAME_COLLECTION)
      .doc(this.ID)
      .update({
        ParticipantIDs: firebase.firestore.FieldValue.arrayUnion(
          JSON.parse(JSON.stringify(newParticipant))
        ),
      });
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
