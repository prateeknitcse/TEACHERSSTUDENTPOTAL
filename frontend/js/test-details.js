const testId = localStorage.getItem("selectedTestId");

if (!testId) location.href = "tests.html";

async function loadDetails() {
  const res = await fetch(
    `http://localhost:5000/api/tests/by-id/${testId}`,
    { headers: { Authorization: localStorage.getItem("token") } }
  );

  const test = await res.json();
  document.getElementById("title").innerText = test.title;
  document.getElementById("marks").innerText = test.questions.length;
}

document.getElementById("analysisBtn").onclick = () => {
  location.href = "result.html";
};

document.getElementById("leaderboardBtn").onclick = () => {
  localStorage.setItem("testIdForLeaderboard", testId);
  location.href = "leaderboard.html";
};

loadDetails();
