import React, { useContext, useEffect, useState } from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import firebaseConfig from "./firestore_secrets.json";

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
let auth = firebase.auth();

const useAuth = () => {
  const [state, setState] = useState(() => {
    const user = auth.currentUser;
    return { initializing: !user, user };
  });

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setState({ initializing: false, user });
    });
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, []);

  return state;
};

export { firebase, db, useAuth, auth };
