import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjjdQbCi-9xTfWQBGpGrCwc3lgzPUngGA",
  authDomain: "e-commerc-test.firebaseapp.com",
  projectId: "e-commerc-test",
  storageBucket: "e-commerc-test.firebasestorage.app",
  messagingSenderId: "610204654058",
  appId: "1:610204654058:web:cce0440c901ba3b57dba93",
  measurementId: "G-WDMCZVFK3V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
