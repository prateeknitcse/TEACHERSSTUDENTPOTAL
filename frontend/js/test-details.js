const testId = localStorage.getItem("selectedTestId");

if (!testId) {
  location.href = "tests.html";
}

const leaderboardBtn = document.getElementById("leaderboardBtn");
const leaderboardNote = document.getElementById("leaderboardNote");

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
    const now = new Date();

    // 🔒 Disable leaderboard until test ends
    if (now < endTime) {
      leaderboardBtn.disabled = true;
      leaderboardNote.innerText =
        "Leaderboard will be available after the test ends.";
    } else {
      leaderboardBtn.disabled = false;
      leaderboardNote.innerText = "";
    }

    leaderboardBtn.onclick = () => {
      localStorage.setItem("testIdForLeaderboard", testId);
      location.href = "leaderboard.html";
    };

  } catch (err) {
    console.error(err);
    alert("Error loading test details");
  }
}

document.getElementById("analysisBtn").onclick = () => {
  location.href = "result.html";
};

loadDetails();
