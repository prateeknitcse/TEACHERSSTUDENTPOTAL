// 🔴 FIX: read the CORRECT key
const testId = localStorage.getItem("testId");

if (!testId) {
  location.href = "tests.html";
}

const leaderboardBtn = document.getElementById("leaderboardBtn");
const leaderboardNote = document.getElementById("leaderboardNote");
const analysisBtn = document.getElementById("analysisBtn");

let unlockTimer = null;

analysisBtn.onclick = () => {
  location.href = "result.html";
};

async function loadDetails() {
  try {
    const res = await fetch(
      `http://localhost:5000/api/tests/by-id/${testId}`,
      {
        headers: { Authorization: localStorage.getItem("token") }
      }
    );

    if (!res.ok) {
      alert("Failed to load test");
      return;
    }

    const test = await res.json();

    document.getElementById("title").innerText = test.title;
    document.getElementById("marks").innerText =
      test.questions.length;

    const endTime = new Date(test.endTime);

    leaderboardBtn.onclick = () => {
      localStorage.setItem("testIdForLeaderboard", testId);
      location.href = "leaderboard.html";
    };

    startLeaderboardCountdown(endTime);

  } catch (err) {
    console.error(err);
    alert("Error loading test details");
  }
}

function startLeaderboardCountdown(endTime) {
  unlockTimer = setInterval(() => {
    const now = new Date();
    const diff = endTime - now;

    if (diff <= 0) {
      clearInterval(unlockTimer);
      leaderboardBtn.disabled = false;
      leaderboardBtn.classList.remove("disabled-btn");
      leaderboardNote.innerText = "";
      return;
    }

    leaderboardBtn.disabled = true;
    leaderboardBtn.classList.add("disabled-btn");

    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    leaderboardNote.innerText =
      `Leaderboard unlocks in ${mins} min ${secs} sec`;
  }, 1000);
}

loadDetails();
