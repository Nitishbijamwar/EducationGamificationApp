import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("signupBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // ✅ Save new user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        points: 0,
        badges: [],
      });

      alert("Signup successful!");
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert(error.message);
    });
});
