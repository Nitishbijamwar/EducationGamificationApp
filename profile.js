import { auth, db } from "./firebase-config.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

auth.onAuthStateChanged(async (user) => {
  if (user) {
    document.getElementById("userEmail").textContent = user.email;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();

      document.getElementById("userPoints").textContent = data.points || 0;
      document.getElementById("userBadges").textContent =
        data.badges?.join(", ") || "No badges yet";

      const last = data.lastQuiz;
      document.getElementById("lastQuiz").textContent = last
        ? `${last.score} / ${last.total} on ${last.date}`
        : "No quizzes taken yet.";
    } else {
      alert("User data not found in Firestore.");
    }
  } else {
    window.location.href = "login.html";
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});
