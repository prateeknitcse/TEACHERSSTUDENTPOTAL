// 🔐 Auth guard
if (!localStorage.getItem("token")) {
  location.href = "index.html";
}

const classSelect = document.getElementById("classSelect");
const testsGrid = document.getElementById("testsGrid");
const analyticsPanel = document.getElementById("analyticsPanel");
const leaderboardBody = document.getElementById("leaderboardBody");
const summaryGrid = document.getElementById("summaryGrid");

// 🏫 Load tests when class selected
classSelect.onchange = async () => {
  const className = classSelect.value;
  testsGrid.innerHTML = "";
  analyticsPanel.style.display = "none";

  if (!className) return;

  const res = await fetch(
    `http://localhost:5000/api/tests/class/${className}`,
    { headers: { Authorization: localStorage.getItem("token") } }
  );

  const tests = await res.json();

  if (!tests.length) {
    testsGrid.innerHTML = "<p class='note'>No tests found</p>";
    return;
  }

  tests.forEach(test => {
    const card = document.createElement("div");
    card.className = "box clickable";
    card.innerHTML = `
      <h3>${test.title}</h3>
      <p>${new Date(test.startTime).toLocaleString()}</p>
    `;

    card.onclick = () => loadTestAnalytics(test._id);
    testsGrid.appendChild(card);
  });
};

// 📊 Load analytics for selected test
async function loadTestAnalytics(testId) {
  const res = await fetch(
    `http://localhost:5000/api/tests/leaderboard/${testId}`,
    { headers: { Authorization: localStorage.getItem("token") } }
  );

  if (!res.ok) {
    alert("Analytics available after test ends");
    return;
  }

  const leaderboard = await res.json();

  analyticsPanel.style.display = "block";
  leaderboardBody.innerHTML = "";
  summaryGrid.innerHTML = "";

  const attempts = leaderboard.length;
  const avg =
    attempts === 0
      ? 0
      : Math.round(
          leaderboard.reduce((s, r) => s + r.score, 0) / attempts
        );

  summaryGrid.innerHTML = `
    <div class="box">Attempts<br><strong>${attempts}</strong></div>
    <div class="box">Average<br><strong>${avg}</strong></div>
    <div class="box">Topper<br><strong>${leaderboard[0]?.name || "—"}</strong></div>
  `;

  leaderboard.forEach((row, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>#${i + 1}</td>
      <td>${row.name}</td>
      <td>${row.score}</td>
    `;
    leaderboardBody.appendChild(tr);
  });
}
