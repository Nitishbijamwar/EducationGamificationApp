import { auth, db } from "./firebase-config.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    alert("Please log in to view your rewards.");
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    const rewardsList = document.getElementById("rewards-list");

    const points = userData.points || 0;
    const badges = userData.badges || [];

    let html = `<p>🏆 <strong>Total Points:</strong> ${points}</p>`;

    if (badges.length > 0) {
      html += `<p>🎖️ <strong>Badges Earned:</strong></p><ul>`;
      badges.forEach((badge) => {
        html += `<li>⭐ ${badge}</li>`;
      });
      html += `</ul>`;
    } else {
      html += `<p>No badges earned yet. Keep playing!</p>`;
    }

    rewardsList.innerHTML = html;
  } else {
    document.getElementById("rewards-list").textContent =
      "No reward data found.";
  }
});
