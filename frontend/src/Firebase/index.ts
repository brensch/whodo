import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useAuth } from "./Auth";
import firebaseConfig from "./FirestoreSecrets";

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
let auth = firebase.auth();

if (window.location.hostname === "localhost") {
  console.log(
    "testing locally -- hitting local functions and firestore emulators",
  );
  firebase.firestore().settings({
    host: "localhost:8080",
    ssl: false,
  });
}

export { firebase, db, useAuth, auth };
