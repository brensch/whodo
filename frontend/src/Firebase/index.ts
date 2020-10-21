import React, { useContext, useEffect, useState } from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import firebaseConfig from "./firestore_secrets.json";
import { useAuth } from "./Auth";

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
let auth = firebase.auth();

// if (window.location.hostname === "localhost") {
//   console.log(
//     "testing locally -- hitting local functions and firestore emulators",
//   );
//   firebase.firestore().settings({
//     host: "localhost:5002",
//     ssl: false,
//   });
// }

export { firebase, db, useAuth, auth };
