// 🔐 Auth protection
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

const testId = localStorage.getItem("testIdForLeaderboard");
const backBtn = document.getElementById("backBtn");

if (!testId) {
  alert("No test selected");
  window.location.href = "dashboard.html";
}

backBtn.onclick = () => {
  window.location.href = "dashboard.html";
};

async function loadLeaderboard() {
  try {
    const res = await fetch(
      `http://localhost:5000/api/results/leaderboard/${testId}`,
      {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      }
    );

    const data = await res.json();

    // ⛔ Test not ended yet
    if (res.status === 403) {
      alert(data.msg);
      window.location.href = "dashboard.html";
      return;
    }

    const tbody = document.getElementById("leaderboardBody");
    tbody.innerHTML = "";

    data.forEach((row, index) => {
      const tr = document.createElement("tr");
      tr.className = "leaderboard-row";
      tr.innerHTML = `
        <td>#${row.rank}</td>
        <td>${row.name}</td>
        <td>${row.score}</td>
      `;
      tbody.appendChild(tr);
    });

    // 🎬 KEEP YOUR ANIMATION
    const rows = document.querySelectorAll(".leaderboard-row:not(.header)");
    rows.forEach((row, i) => {
      row.style.animationDelay = `${i * 0.08}s`;
    });

  } catch (err) {
    console.error(err);
    alert("Failed to load leaderboard");
  }
}

loadLeaderboard();
