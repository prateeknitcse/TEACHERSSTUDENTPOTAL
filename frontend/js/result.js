// 🔐 Auth protection
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

const scoreEl = document.getElementById("score");
const correctEl = document.getElementById("correct");
const wrongEl = document.getElementById("wrong");
const analysisEl = document.getElementById("analysis");
const backBtn = document.getElementById("backBtn");
const viewLeaderboardBtn = document.getElementById("viewLeaderboardBtn");

backBtn.onclick = () => {
  window.location.href = "dashboard.html";
};

async function loadResult() {
  try {
    const res = await fetch("http://localhost:5000/api/results/my-latest", {
      headers: {
        "Authorization": localStorage.getItem("token")
      }
    });

    if (!res.ok) {
      alert("No result found");
      return;
    }

    const data = await res.json();

    // Save testId for leaderboard
    localStorage.setItem("testIdForLeaderboard", data.testId._id);

    const total = data.answers.length;
    const correct = data.answers.filter(a => a.selected === a.correct).length;
    const wrong = total - correct;

    scoreEl.innerText = `${correct} / ${total}`;
    correctEl.innerText = correct;
    wrongEl.innerText = wrong;

    // Render question-wise analysis
    analysisEl.innerHTML = "";

    data.answers.forEach((a, i) => {
      const div = document.createElement("div");
      div.className =
        "analysis-card " +
        (a.selected === a.correct ? "correct" : "wrong");

      div.innerHTML = `
        <p class="q-title">Q${i + 1}. ${a.question}</p>
        <p>Your Answer: <strong>${a.selected}</strong></p>
        <p>Correct Answer: <strong>${a.correct}</strong></p>
      `;

      analysisEl.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    alert("Failed to load result");
  }
}

// Leaderboard button
viewLeaderboardBtn.onclick = () => {
  window.location.href = "leaderboard.html";
};

loadResult();
