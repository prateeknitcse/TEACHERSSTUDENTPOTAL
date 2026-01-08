let questions = [];
let current = 0;
let selected = null;
let answers = [];
let testId = localStorage.getItem("testId");

let remainingSeconds = 0;
let timerInterval = null;

const qEl = document.getElementById("question");
const optContainer = document.getElementById("options") || document.querySelector(".options");
const qNo = document.getElementById("qNo");
const totalQ = document.getElementById("totalQ");
const timerEl = document.getElementById("timer");
const nextBtn = document.getElementById("nextBtn");

// 🔐 AUTH + FLOW PROTECTION
if (!localStorage.getItem("token") || !testId) {
  alert("Invalid test access");
  window.location.href = "dashboard.html";
}

// 🔹 LOAD TEST BY testId (LIVE ONLY)
async function loadTest() {
  try {
    const res = await fetch(`http://localhost:5000/api/tests/by-id/${testId}`, {
      headers: {
        "Authorization": localStorage.getItem("token")
      }
    });

    if (!res.ok) {
      alert("Test not available");
      window.location.href = "dashboard.html";
      return;
    }

    const data = await res.json();

    // 🔒 Enforce live window (unchanged)
    const now = new Date();
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (now < start) {
      alert("Test has not started yet");
      window.location.href = "dashboard.html";
      return;
    }

    if (now > end) {
      alert("Test has already ended");
      window.location.href = "dashboard.html";
      return;
    }

    // ✅ INIT TEST
    document.getElementById("testTitle").innerText = data.title;
    questions = data.questions;

    // ⏱ USE ADMIN-SET DURATION (minutes → seconds)
    remainingSeconds = data.duration * 60;

    qNo.innerText = 1;
    totalQ.innerText = questions.length;

    startTimer();
    loadQuestion();

  } catch (err) {
    console.error(err);
    alert("Failed to load test");
    window.location.href = "dashboard.html";
  }
}

// 🔹 RENDER QUESTION
function loadQuestion() {
  const q = questions[current];
  qNo.innerText = current + 1;
  qEl.innerText = q.question;

  optContainer.innerHTML = "";
  selected = null;

  q.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.innerText = opt;

    btn.onclick = () => {
      document
        .querySelectorAll(".option")
        .forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selected = index;
    };

    optContainer.appendChild(btn);
  });
}

// 🔹 NEXT / SUBMIT
nextBtn.onclick = () => {
  if (selected === null) {
    alert("Please select an option");
    return;
  }

  answers.push({
    question: questions[current].question,
    selected,
    correct: questions[current].correct
  });

  current++;

  if (current < questions.length) {
    loadQuestion();
  } else {
    submitTest(false);
  }
};

// 🔹 SUBMIT TEST (AUTO / MANUAL)
async function submitTest(auto = false) {
  clearInterval(timerInterval);

  let score = 0;
  answers.forEach(a => {
    if (a.selected === a.correct) score++;
  });

  try {
    const res = await fetch("http://localhost:5000/api/results/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      },
      body: JSON.stringify({
        testId,
        score,
        answers,
        autoSubmitted: auto
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || "Submission failed");
      window.location.href = "dashboard.html";
      return;
    }

    localStorage.removeItem("testId");
    window.location.href = "result.html";

  } catch (err) {
    console.error(err);
    alert("Submission error");
    window.location.href = "dashboard.html";
  }
}

// 🔹 TIMER (DURATION-BASED + AUTO SUBMIT)
function startTimer() {
  updateTimerUI();

  timerInterval = setInterval(() => {
    remainingSeconds--;

    if (remainingSeconds <= 0) {
      submitTest(true); // ⛔ AUTO SUBMIT
      return;
    }

    updateTimerUI();
  }, 1000);
}

function updateTimerUI() {
  const min = Math.floor(remainingSeconds / 60);
  const sec = remainingSeconds % 60;
  timerEl.innerText = `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

// 🚀 INIT
loadTest();
