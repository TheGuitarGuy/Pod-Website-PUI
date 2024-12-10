import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, serverTimestamp, Timestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBGMr1AVpSxdEa8nwpZiEqq96qAo0pKocM",
    authDomain: "vida-dating.firebaseapp.com",
    databaseURL: "https://vida-dating-default-rtdb.firebaseio.com",
    projectId: "vida-dating",
    storageBucket: "vida-dating.appspot.com",
    messagingSenderId: "157199511395",
    appId: "1:157199511395:web:8f8d58a73f38af9fcbed56",
    measurementId: "G-LLHBMWWM9Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, onAuthStateChanged, serverTimestamp, Timestamp };
