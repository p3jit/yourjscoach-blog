// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDN5oJaW7rZapiZxyNCPUwqmDKJonJ18-E",
  authDomain: "wa2frontend.firebaseapp.com",
  projectId: "wa2frontend",
  storageBucket: "wa2frontend.appspot.com",
  messagingSenderId: "545152895497",
  appId: "1:545152895497:web:c74e38907d723ee35346d8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
