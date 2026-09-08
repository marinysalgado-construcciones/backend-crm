import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBolkOXzlhGPY1HKl7LCkzy3TMHqP2ObxA",
  authDomain: "catalogo---pyp.firebaseapp.com",
  projectId: "catalogo---pyp",
  storageBucket: "catalogo---pyp.firebasestorage.app",
  messagingSenderId: "785701169071",
  appId: "1:785701169071:web:2e2a2b4290c8b64005715a",
  measurementId: "G-F4N19H7TR0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);