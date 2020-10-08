import React, { useContext, useEffect, useState } from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import firebaseConfig from "./firestore_secrets.json";
import { useAuth } from "./Auth";

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
let auth = firebase.auth();

export { firebase, db, useAuth, auth };
