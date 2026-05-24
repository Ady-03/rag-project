import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const apiKey = process.env.GROQ_API_KEY || process.env.REACT_APP_GROQ_API_KEY;

const firebaseConfig = {
  apiKey,
  authDomain: "ragchat-0304.firebaseapp.com",
  projectId: "ragchat-0304",
  storageBucket: "ragchat-0304.firebasestorage.app",
  messagingSenderId: "252486495283",
  appId: "252486495283:web:b6f85e03fc0ca758bb4746",
  measurementId: "G-YPLRS8QMQD",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
