import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_R06n9-LzyLQBb85Mv9l6coW3ndWYr0k",
  authDomain: "shared-checklist-f0b98.firebaseapp.com",
  projectId: "shared-checklist-f0b98",
  storageBucket: "shared-checklist-f0b98.appspot.com",
  messagingSenderId: "661438010346",
  appId: "1:661438010346:web:7e8830bf324b1cf4381893",
  databaseURL: "",
};
firebase.initializeApp(firebaseConfig);

// utils
const db = firebase.firestore();
const auth = firebase.auth();

// collection references
const usersCollection = db.collection("users");
const checklistsCollection = db.collection("checklists");

// export utils/refs
export { db, auth, usersCollection, checklistsCollection };
