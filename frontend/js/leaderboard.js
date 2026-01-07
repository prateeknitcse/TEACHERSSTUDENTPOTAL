// 🔐 Auth protection
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// Decode JWT to get current student id
const payload = JSON.parse(atob(localStorage.getItem("token").split(".")[1]));
const currentStudentId = payload.id;

const testId = localStorage.getItem("testIdForLeaderboard");
const backBtn = document.getElementById("backBtn");
const tbody = document.getElementById("leaderboardBody");

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

    // ⛔ Blocked before test end
    if (res.status === 403) {
      alert(data.msg);
      window.location.href = "dashboard.html";
      return;
    }

    tbody.innerHTML = "";

    data.forEach((row, i) => {
      const tr = document.createElement("tr");
      tr.className = "leaderboard-row";

      // ⭐ Highlight current student
      if (row.studentId === currentStudentId) {
        tr.classList.add("me");
      }

      tr.innerHTML = `
        <td>#${row.rank}</td>
        <td>
          ${row.name}
          ${row.studentId === currentStudentId ? "<strong>(You)</strong>" : ""}
        </td>
        <td>${row.score}</td>
      `;

      tbody.appendChild(tr);
    });

    // 🎬 Keep your animation
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
