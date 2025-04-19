import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDGhKfgNmRU2dv0B3gw4dqZg2VI9Bg_Qek",
  authDomain: "edugamifyapp.firebaseapp.com",
  projectId: "edugamifyapp",
  storageBucket: "edugamifyapp.firebasestorage.app",
  messagingSenderId: "805321460486",
  appId: "1:805321460486:web:d5b8ec4503b07391862c87",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
