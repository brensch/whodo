import { UserDetails } from "./User";
import { Character, CharacterName, Story } from "./Story";
import { db } from "../Firebase";
import * as firebase from "firebase/app";

const GAME_COLLECTION = "games";

export class Game {
  ID: string = "new_game_instance";
  Name?: string;
  OwnerID?: string;
  ParticipantIDs: Array<string> = [];
  Participants: Array<Participant> = [];

  CurrentAnswer = 0;
  CurrentRound = 0;
  ParticipantsLocked = false;
  DiscoveredClues: Array<number> = [];

  Story: Story | null = null;

  StartTime: firebase.firestore.Timestamp = firebase.firestore.Timestamp.fromDate(
    new Date(),
  );

  // internal fields, not to be synced to firestore
  participantsStillDeciding: Array<Participant> = [];
  participantsReadyToStart: Array<Participant> = [];
  participantsStillGuessing: Array<Participant> = [];
  participantsReadyForAnswer: Array<Participant> = [];

  constructor(
    user: UserDetails | null = null,
    gameFromFirestore: Game | null = null,
  ) {
    if (user !== null) {
      this.OwnerID = user.ID;
      this.ParticipantIDs = [user.ID];
      const participant = new Participant(user);
      this.Participants = [participant];
    } else if (gameFromFirestore !== null) {
      this.ID = gameFromFirestore.ID;
      this.Name = gameFromFirestore.Name;
      this.OwnerID = gameFromFirestore.OwnerID;
      this.ParticipantIDs = gameFromFirestore.ParticipantIDs;
      this.Participants = gameFromFirestore.Participants;
      this.CurrentAnswer = gameFromFirestore.CurrentAnswer;
      this.CurrentRound = gameFromFirestore.CurrentRound;
      this.ParticipantsLocked = gameFromFirestore.ParticipantsLocked;
      this.DiscoveredClues = gameFromFirestore.DiscoveredClues;
      this.Story = gameFromFirestore.Story;
      const { nanoseconds, seconds } = gameFromFirestore.StartTime;
      this.StartTime = new firebase.firestore.Timestamp(seconds, nanoseconds);

      // find participants still deciding
      this.participantsStillDeciding = this.Participants.filter(
        (participant) => participant.Character === null,
      );
      this.participantsReadyToStart = this.Participants.filter(
        (participant) => participant.ReadyToStart,
      );
      this.participantsStillGuessing = this.Participants.filter(
        (participant) => participant.Guess === null,
      );
      this.participantsReadyForAnswer = this.Participants.filter(
        (participant) => participant.ReadyForAnswer,
      );
    }
    console.log(this);
  }

  lockParticipants() {
    return db.collection("games").doc(this.ID).update({
      ParticipantsLocked: true,
    });
  }

  unlockParticipants() {
    return db.collection("games").doc(this.ID).update({
      ParticipantsLocked: false,
    });
  }

  pickStory(story: Story) {
    if (this.Participants.length === story.Characters.length) {
      return db.collection(GAME_COLLECTION).doc(this.ID).update({
        Story: story,
      });
    }
    throw "not enough players for this game";
  }

  addToFirestore(name: string, startTime: Date) {
    this.Name = name;
    this.StartTime = firebase.firestore.Timestamp.fromDate(startTime);

    // remove all props we don't want to sync to the cloud, but are computing locally instead
    const {
      participantsStillDeciding,
      participantsReadyToStart,
      participantsStillGuessing,
      participantsReadyForAnswer,
      ...propsToCloudify
    } = this;

    // this feels dirty, but not as dirty as the fact that the firestore arbitrarily blocks
    // custom objects just because they can't guarantee they'll stay typesafe
    return db
      .collection(GAME_COLLECTION)
      .add(JSON.parse(JSON.stringify(propsToCloudify)));
  }

  addParticipant(user: UserDetails) {
    if (user.ID in this.ParticipantIDs) {
      throw "user already in game";
    }
    const newParticipant = new Participant(user);
    console.log(`adding participant ${newParticipant.User.ID}`);
    return db
      .collection(GAME_COLLECTION)
      .doc(this.ID)
      .update({
        Participants: firebase.firestore.FieldValue.arrayUnion(
          JSON.parse(JSON.stringify(newParticipant)),
        ),
        ParticipantIDs: firebase.firestore.FieldValue.arrayUnion(
          newParticipant.User.ID,
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
        receivedGame.ID = snapshot.id;
        const game = new Game(null, receivedGame);

        set(game);
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
  Character: Character | null = null;

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
    public Ready: boolean,
  ) {}
}

export class Note {
  constructor(
    public Message: string,
    public Round: number,
    public Subject: CharacterName | null,
  ) {}
}
