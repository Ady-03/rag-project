import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBIbIFIS0NeeJD8Qk9ZIjnGM7i8-gum-JY",
  authDomain: "ragchat-0304.firebaseapp.com",
  projectId: "ragchat-0304",
  storageBucket: "ragchat-0304.firebasestorage.app",
  messagingSenderId: "252486495283",
  appId: "1:252486495283:web:b6f85e03fc0ca758bb4746",
  measurementId: "G-YPLRS8QMQD",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
