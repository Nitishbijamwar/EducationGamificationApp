import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDGhKfgNmRU2dv0B3gw4dqZg2VI9Bg_Qek",
  authDomain: "edugamifyapp.firebaseapp.com",
  projectId: "edugamifyapp",
  storageBucket: "edugamifyapp.firebasestorage.app",
  messagingSenderId: "805321460486",
  appId: "1:805321460486:web:d5b8ec4503b07391862c87",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    const name = user.email.split("@")[0];
    document.getElementById("userName").textContent = name;
  } else {
    window.location.href = "login.html";
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("Error logging out!");
      console.error(error);
    });
});

document.getElementById("quizCard").addEventListener("click", function () {
  window.location.href = "quiz.html";
});

document.getElementById("rewardsCard").addEventListener("click", () => {
  window.location.href = "rewards.html";
});

document.getElementById("profileCard").addEventListener("click", () => {
  window.location.href = "profile.html";
});

document.getElementById("leaderboardCard").addEventListener("click", () => {
  window.location.href = "leaderboard.html";
});
