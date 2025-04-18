// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDvoFDZChR8YYobqTG3anVO-4--21aU3-Y",
    authDomain: "zoomish-webrtc.firebaseapp.com",
    projectId: "zoomish-webrtc",
    storageBucket: "zoomish-webrtc.appspot.com",
    messagingSenderId: "333170190169",
    appId: "1:333170190169:web:046b4205c14764e10b0e48",
    measurementId: "G-D1EZB85L11"
  };

const app = initializeApp(firebaseConfig);

export const firestore1 = getFirestore(app);
export const fireAuth = getAuth(app);
export const provider = new GoogleAuthProvider();
