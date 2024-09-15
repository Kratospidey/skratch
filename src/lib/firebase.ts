// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIQklcPfcx1wgofj0Czhvp2mkiyY6SFvc",
  authDomain: "skratch-c3290.firebaseapp.com",
  databaseURL: "https://skratch-c3290-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "skratch-c3290",
  storageBucket: "skratch-c3290.appspot.com",
  messagingSenderId: "619055580172",
  appId: "1:619055580172:web:c4712b3286d09be4771a29",
  measurementId: "G-MTSH2RWE9K"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only on the client)
// let analytics;
// if (typeof window !== 'undefined') {
//   // Import analytics only on the client
//   const { getAnalytics } = require('firebase/analytics');
//   analytics = getAnalytics(app);
// }


// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { app, database, auth };
