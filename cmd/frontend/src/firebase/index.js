import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {};

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
let auth = firebase.auth();

export { firebase, db, auth };
