import { UserDetails, USER_DETAILS_COLLECTION } from "./User";
// import { Character, CharacterName, Story } from "./Story";
import { db } from "../Firebase";
import * as firebase from "firebase/app";
import { Story, StoryMetadata, CharacterStory, Clue } from "./Story";
import { Character } from "./Story2";

export const GAME_COLLECTION = "games";
export const PLAYERVIEW_COLLECTION = "playerviews";

export interface GameState {
  // ID: string;
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

  // FinishedGuessing: string[];
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

// export interface Participant {
//   UserDetails: UserDetails;
//   Character: Character;
// }

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

// export class Game {
//   ID: string = "new_game_instance";
//   Name?: string;
//   OwnerID?: string;
//   ParticipantIDs: Array<string> = [];
//   Participants: Array<Participant> = [];

//   CurrentAnswer = 0;
//   CurrentRound = 0;
//   ParticipantsLocked = false;
//   DiscoveredClues: Array<number> = [];

//   Story: Story | null = null;

//   StartTime: firebase.firestore.Timestamp | null = null;

//   // internal fields, not to be synced to firestore
//   participantsStillDeciding: Array<Participant> = [];
//   participantsReadyToStart: Array<Participant> = [];
//   participantsStillGuessing: Array<Participant> = [];
//   participantsReadyForAnswer: Array<Participant> = [];

//   constructor(gameFromFirestore: Game | null | undefined = null) {
//     try {
//       if (gameFromFirestore !== null && gameFromFirestore !== undefined) {
//         this.ID = gameFromFirestore.ID;
//         this.Name = gameFromFirestore.Name;
//         this.OwnerID = gameFromFirestore.OwnerID;
//         this.ParticipantIDs = gameFromFirestore.ParticipantIDs;
//         this.Participants = gameFromFirestore.Participants;
//         this.CurrentAnswer = gameFromFirestore.CurrentAnswer;
//         this.CurrentRound = gameFromFirestore.CurrentRound;
//         this.ParticipantsLocked = gameFromFirestore.ParticipantsLocked;
//         this.DiscoveredClues = gameFromFirestore.DiscoveredClues;
//         this.Story = gameFromFirestore.Story;
//         if (gameFromFirestore.StartTime !== null) {
//           const { nanoseconds, seconds } = gameFromFirestore.StartTime;
//           this.StartTime = new firebase.firestore.Timestamp(
//             seconds,
//             nanoseconds,
//           );
//         }

//         // find participants still deciding
//         this.participantsStillDeciding = this.Participants.filter(
//           (participant) => participant.Character === null,
//         );
//         this.participantsReadyToStart = this.Participants.filter(
//           (participant) => participant.ReadyToStart,
//         );
//         this.participantsStillGuessing = this.Participants.filter(
//           (participant) => participant.Guess === null,
//         );
//         this.participantsReadyForAnswer = this.Participants.filter(
//           (participant) => participant.ReadyForAnswer,
//         );
//       }
//     } catch (error) {
//       console.log(this.ID, error);
//       this.ID = "invalid";
//     }
//   }

//   lockParticipants() {
//     return db.collection("games").doc(this.ID).update({
//       ParticipantsLocked: true,
//     });
//   }

//   unlockParticipants() {
//     return db.collection("games").doc(this.ID).update({
//       ParticipantsLocked: false,
//     });
//   }

//   pickStory(story: Story) {
//     if (this.Participants.length === story.Characters.length) {
//       return db.collection(GAME_COLLECTION).doc(this.ID).update({
//         Story: story,
//       });
//     }
//     throw "not enough players for this game";
//   }

//   addToFirestore(name: string, startTime: Date, owner: UserDetails) {
//     this.Name = name;
//     this.StartTime = firebase.firestore.Timestamp.fromDate(startTime);
//     this.OwnerID = owner.ID;
//     // remove all props we don't want to sync to the cloud, but are computing locally instead
//     const {
//       ID,
//       participantsStillDeciding,
//       participantsReadyToStart,
//       participantsStillGuessing,
//       participantsReadyForAnswer,
//       ...propsToCloudify
//     } = this;

//     // this feels dirty, but not as dirty as the fact that the firestore arbitrarily blocks
//     // custom objects just because they can't guarantee they'll stay typesafe
//     return db
//       .collection(GAME_COLLECTION)
//       .add(JSON.parse(JSON.stringify(propsToCloudify)))
//       .then((doc) => {
//         this.ID = doc.id;
//         return this.addParticipant(owner);
//       });
//   }

//   addParticipant(user: UserDetails) {
//     if (user.ID in this.ParticipantIDs) {
//       throw "user already in game";
//     }
//     const newParticipant = new Participant(user);
//     console.log(`adding participant ${newParticipant.User.ID}`);

//     // Uncomment to initialize the doc.
//     // sfDocRef.set({ population: 0 });

//     var batch = db.batch();

//     const gameDoc = db.collection(GAME_COLLECTION).doc(this.ID);
//     const userDoc = db.collection(USER_DETAILS_COLLECTION).doc(user.ID);
//     batch.update(gameDoc, {
//       Participants: firebase.firestore.FieldValue.arrayUnion(
//         JSON.parse(JSON.stringify(newParticipant)),
//       ),
//       ParticipantIDs: firebase.firestore.FieldValue.arrayUnion(
//         newParticipant.User.ID,
//       ),
//     });
//     batch.update(userDoc, {
//       Games: firebase.firestore.FieldValue.arrayUnion(this.ID),
//     });

//     return batch.commit();
//   }

//   connect(id: string, set: React.Dispatch<React.SetStateAction<Game | null>>) {
//     this.ID = id;
//     try {
//       db.collection(GAME_COLLECTION)
//         .doc(id)
//         .onSnapshot((doc) => {
//           const wholeReceivedData = {
//             ID: doc.id,
//             ...doc.data(),
//           } as unknown;
//           const game = new Game(wholeReceivedData as Game);

//           set(game);
//         });
//     } catch (err) {
//       throw err;
//     }
//   }
// }

// export class Participant {
//   User: UserDetails;
//   RoundStates: Array<RoundState> = [];
//   Notes: Array<Note> = [];
//   ReadRules: boolean = false;
//   ReadyForAnswer: boolean = false;
//   ReadyToStart: boolean = false;
//   SeenClues: Array<number> = [];
//   Guess: Guess | null = null;
//   Character: Character | null = null;

//   constructor(User: UserDetails) {
//     this.User = User;
//   }
// }

// export class Guess {
//   constructor(public Killer: CharacterName, public Why: string) {}
// }

// export class RoundState {
//   constructor(
//     public Private: Array<boolean>,
//     public Public: Array<boolean>,
//     public Ready: boolean,
//   ) {}
// }

// export class Note {
//   constructor(
//     public Message: string,
//     public Round: number,
//     public Subject: CharacterName | null,
//   ) {}
// }
