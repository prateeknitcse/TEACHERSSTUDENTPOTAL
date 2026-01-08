let questions = [];
let current = 0;
let selected = null;
let answers = [];
let testId = localStorage.getItem("testId");

let remainingSeconds = 0;
let timerInterval = null;
let autosaveInterval = null;
let warned = false;

const STORAGE_KEY = `activeTest_${testId}`;

const qEl = document.getElementById("question");
const optContainer = document.getElementById("options");
const qNo = document.getElementById("qNo");
const totalQ = document.getElementById("totalQ");
const timerEl = document.getElementById("timer");
const nextBtn = document.getElementById("nextBtn");

// 🔐 AUTH + FLOW PROTECTION
if (!localStorage.getItem("token") || !testId) {
  alert("Invalid test access");
  location.href = "dashboard.html";
}

// 🔹 LOAD TEST
async function loadTest() {
  try {
    const res = await fetch(
      `http://localhost:5000/api/tests/by-id/${testId}`,
      { headers: { Authorization: localStorage.getItem("token") } }
    );

    const data = await res.json();

    const now = new Date();
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (now < start || now > end) {
      alert("Test not active");
      location.href = "dashboard.html";
      return;
    }

    document.getElementById("testTitle").innerText = data.title;
    questions = data.questions;
    totalQ.innerText = questions.length;

    restoreProgress(data.duration);
    startTimer();
    startAutoSave();
    loadQuestion();

  } catch (err) {
    alert("Failed to load test");
    location.href = "dashboard.html";
  }
}

// 🔹 RESTORE PROGRESS
function restoreProgress(duration) {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (saved) {
    answers = saved.answers || [];
    current = saved.current || 0;
    remainingSeconds = saved.remainingSeconds;
  } else {
    remainingSeconds = duration * 60;
  }
}

// 🔹 SAVE PROGRESS
function saveProgress() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      answers,
      current,
      remainingSeconds
    })
  );
}

// 🔹 AUTO SAVE EVERY 10 SECONDS
function startAutoSave() {
  autosaveInterval = setInterval(saveProgress, 10000);
}

// 🔹 LOAD QUESTION
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
      document.querySelectorAll(".option")
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
    alert("Select an option");
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

// 🔹 TIMER + WARNING
function startTimer() {
  updateTimerUI();

  timerInterval = setInterval(() => {
    remainingSeconds--;

    // ⚠️ 1-minute warning
    if (remainingSeconds === 60 && !warned) {
      warned = true;
      alert("⚠️ Only 1 minute left!");
    }

    if (remainingSeconds <= 0) {
      submitTest(true);
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

// 🔹 SUBMIT TEST
async function submitTest(auto) {
  clearInterval(timerInterval);
  clearInterval(autosaveInterval);
  localStorage.removeItem(STORAGE_KEY);

  let score = answers.filter(a => a.selected === a.correct).length;

  await fetch("http://localhost:5000/api/results/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    },
    body: JSON.stringify({
      testId,
      score,
      answers,
      autoSubmitted: auto
    })
  });

  localStorage.removeItem("testId");
  location.href = "result.html";
}

// 🔒 TAB SWITCH PREVENTION
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    alert("⚠️ Tab switching is not allowed. Test will be submitted.");
    submitTest(true);
  }
});

// 🚀 INIT
loadTest();
