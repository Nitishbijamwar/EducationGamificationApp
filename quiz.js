import { auth, db } from "./firebase-config.js";
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

auth.onAuthStateChanged((user) => {
  if (!user) {
    alert("Please log in to take the quiz.");
    window.location.href = "login.html";
  } else {
    console.log("✅ User logged in:", user.uid);
  }
});

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Madrid", "Berlin", "Paris", "Rome"],
    correct: "Paris",
  },
  {
    question: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    correct: "JavaScript",
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Central Style Sheet",
      "Cascading Style Sheets",
      "Computer Style Sheet",
      "Colorful Style Sheet",
    ],
    correct: "Cascading Style Sheets",
  },
];

let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 10;

const questionText = document.getElementById("questionText");
const optionsList = document.getElementById("optionsList");
const feedback = document.getElementById("feedback");
const timerDisplay = document.querySelector("#timer strong");
const nextBtn = document.getElementById("nextBtn");

function loadQuestion() {
  resetTimer();
  const current = questions[currentIndex];
  questionText.textContent = current.question;
  optionsList.innerHTML = "";

  current.options.forEach((option) => {
    const li = document.createElement("li");
    li.textContent = option;
    li.onclick = () => checkAnswer(option, current.correct);
    optionsList.appendChild(li);
  });

  startTimer();
}

function checkAnswer(selected, correct) {
  clearInterval(timer);
  const isCorrect = selected === correct;
  feedback.textContent = isCorrect
    ? "✅ Correct!"
    : `❌ Wrong! Answer: ${correct}`;
  if (isCorrect) score++;

  const allOptions = optionsList.querySelectorAll("li");
  allOptions.forEach((opt) => {
    opt.style.pointerEvents = "none";
    if (opt.textContent === correct) opt.style.backgroundColor = "#a7f3d0";
    else if (opt.textContent === selected)
      opt.style.backgroundColor = "#fecaca";
  });
}

function nextQuestion() {
  feedback.textContent = "";
  currentIndex++;
  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    document.querySelector(".quiz-container").classList.add("hidden");
    document.querySelector(".result-box").classList.remove("hidden");
    document.getElementById(
      "finalScore"
    ).textContent = `${score} / ${questions.length}`;
    saveQuizResult(score, questions.length);
  }
}

function startTimer() {
  timeLeft = 10;
  timerDisplay.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timer);
      feedback.textContent = "⏰ Time's up!";
      const correct = questions[currentIndex].correct;
      const allOptions = optionsList.querySelectorAll("li");
      allOptions.forEach((opt) => {
        opt.style.pointerEvents = "none";
        if (opt.textContent === correct) opt.style.backgroundColor = "#a7f3d0";
      });
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  feedback.textContent = "";
  timerDisplay.textContent = "10";
}

nextBtn.addEventListener("click", nextQuestion);
loadQuestion();
console.log("Saving score:", score, "out of", total);

function saveQuizResult(score, total) {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      alert("User not found!");
      return;
    }

    console.log("✅ Authenticated UID:", user.uid);
    console.log("✅ Email:", user.email);
    console.log("📊 Score to save:", score);

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const newPoints = (userData.points || 0) + score * 10;
      const badges = userData.badges || [];

      if (score === total && !badges.includes("Perfect Quiz")) {
        badges.push("Perfect Quiz");
      }

      await updateDoc(userRef, {
        points: newPoints,
        badges: badges,
        lastQuiz: {
          score,
          total,
          date: new Date().toLocaleString(),
        },
      });

      await addDoc(collection(db, "userScores"), {
        uid: user.uid,
        email: user.email || "no-email",
        score: score,
        date: new Date(),
      });

      alert("🎉 Your quiz result has been saved!");
      window.location.href = "rewards.html";
    } else {
      alert("⚠️ User document not found in Firestore.");
    }
  });
}
