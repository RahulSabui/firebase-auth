// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDZK50GTfPV0MB5xf-hIZBTMdaoLa--vc8",
    authDomain: "sys-auth-5a97f.firebaseapp.com",
    projectId: "sys-auth-5a97f",
    storageBucket: "sys-auth-5a97f.appspot.com",
    messagingSenderId: "375934073417",
    appId: "1:375934073417:web:8117c95540f30e23a69d98",
    measurementId: "G-0LM5F3PYM9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export Firebase auth and other services
export { auth, app };
