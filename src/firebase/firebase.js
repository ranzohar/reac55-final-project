import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3qmwQcb0uenT-iMokDWb9-kjTOzJbCBg",
  authDomain: "react55-final-project-ran.firebaseapp.com",
  projectId: "react55-final-project-ran",
  storageBucket: "react55-final-project-ran.firebasestorage.app",
  messagingSenderId: "487651210172",
  appId: "1:487651210172:web:8616bb4c128778cdaeb1b9",
  measurementId: "G-Y29MK5DJ2X",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
