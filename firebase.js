// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATyxR9FJ5pBgL3cikH0-0rnO2AcfBnbkY",
  authDomain: "sendbycloud-1e09e.firebaseapp.com",
  projectId: "sendbycloud-1e09e",
  storageBucket: "sendbycloud-1e09e.firebasestorage.app",
  messagingSenderId: "151084098924",
  appId: "1:151084098924:web:8edc9eaff314a633177f49",
  measurementId: "G-YMW11H4S9S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Initialize Firebase Auth and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();