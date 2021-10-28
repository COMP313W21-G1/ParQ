// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// expo doesn't support firebase v9 yet
// we instead use firebase@8.2.3
import firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcyN96SIznchdstM6WPHanTz4LcTSPBes",
  authDomain: "rn-parq-comp313.firebaseapp.com",
  projectId: "rn-parq-comp313",
  storageBucket: "rn-parq-comp313.appspot.com",
  messagingSenderId: "82167954376",
  appId: "1:82167954376:web:9bcc96bcd629d4a5bcdefd",
};

// Initialize Firebase
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = firebase.firestore();

export { firebase, db }