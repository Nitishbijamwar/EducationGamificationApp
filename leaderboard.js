import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

async function loadLeaderboard() {
  const leaderboardList = document.getElementById("leaderboardList");

  const q = query(
    collection(db, "userScores"),
    orderBy("score", "desc"),
    limit(10)
  );

  const querySnapshot = await getDocs(q);

  leaderboardList.innerHTML = ""; // Clear old data

  const docs = querySnapshot.docs;

  docs.forEach((doc, index) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `#${index + 1} - ${data.email} - ${data.score} pts`;
    leaderboardList.appendChild(li);
  });
}

loadLeaderboard();
