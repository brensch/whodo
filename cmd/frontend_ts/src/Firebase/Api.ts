import React, { useContext, useEffect, useState } from "react";
// import { db } from "./";
// import { Game, Participant } from "../Schema/Game";
// import { UserDetails } from "../Schema/User";
// import * as firebase from "firebase/app";

// const GAME_COLLECTION = "games";

// export const joinGame = async (GameID: string, user: UserDetails) => {
//   const newParticipant = new Participant(user);

//   //   {
//   //     id: user.id,
//   //     name: user.name,
//   //     email: user.email,
//   //     character: null,
//   //     guess: null,
//   //     ready_for_answer: false,
//   //     ready_to_start: false,
//   //     has_read_rules: false,
//   //     seen_clues: [],
//   //   },
//   console.log(newParticipant);

//   return db
//     .collection(GAME_COLLECTION)
//     .doc(GameID)
//     .update({
//       [`participants.${user.ID}`]: newParticipant,
//       participant_ids: firebase.firestore.FieldValue.arrayUnion(user.ID),
//     });
// };

// // export
