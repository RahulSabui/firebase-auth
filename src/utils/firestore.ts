// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyDZK50GTfPV0MB5xf-hIZBTMdaoLa--vc8",
    authDomain: "sys-auth-5a97f.firebaseapp.com",
    projectId: "sys-auth-5a97f",
    storageBucket: "sys-auth-5a97f.appspot.com",
    messagingSenderId: "375934073417",
    appId: "1:375934073417:web:8117c95540f30e23a69d98",
    measurementId: "G-0LM5F3PYM9"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
