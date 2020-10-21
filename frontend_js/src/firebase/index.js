import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import firebaseConfig from "./firestore_secrets.json";

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
let auth = firebase.auth();

export { firebase, db, auth };
