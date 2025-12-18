// Import Firebase from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDsHLq-FSPFVylgIWd8DqxUO1c7xrN1LpA",
    authDomain: "login-formulario-35adf.firebaseapp.com",
    databaseURL: "https://login-formulario-35adf-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "login-formulario-35adf",
    storageBucket: "login-formulario-35adf.firebasestorage.app",
    messagingSenderId: "223190157832",
    appId: "1:223190157832:web:8b540b8fb53f7d9b261fbd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Export Firebase services
export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, ref, set, get, child };
