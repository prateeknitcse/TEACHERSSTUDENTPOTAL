// 🔐 Auth guard
if (!localStorage.getItem("token")) {
  location.href = "login.html";
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.onclick = () => {
    localStorage.clear();
    location.href = "login.html";
  };
}

// 📊 Load student stats
async function loadStudentStats() {
  try {
    const res = await fetch("http://localhost:5000/api/admin/students", {
      headers: { Authorization: localStorage.getItem("token") }
    });

    if (!res.ok) {
      throw new Error("Unauthorized");
    }

    const students = await res.json();
    document.getElementById("totalStudents").innerText = students.length;

    const filter = document.getElementById("classFilter");
    const classCount = document.getElementById("classStudents");

    filter.onchange = () => {
      if (!filter.value) {
        classCount.innerText = "--";
        return;
      }

      const count = students.filter(
        s => s.className === filter.value
      ).length;

      classCount.innerText = count;
    };

  } catch (err) {
    alert("Failed to load student data");
    console.error(err);
  }
}

// 📈 Load analytics
async function loadAnalytics() {
  try {
    const res = await fetch("http://localhost:5000/api/tests/analytics", {
      headers: { Authorization: localStorage.getItem("token") }
    });

    if (!res.ok) {
      throw new Error("Unauthorized");
    }

    const data = await res.json();
    const container = document.getElementById("analytics");
    container.innerHTML = "";

    data.forEach(test => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${test.title}</h3>
        <p><strong>Class:</strong> ${test.className}</p>
        <p><strong>Attempts:</strong> ${test.attempts}</p>
        <p><strong>Average Score:</strong> ${test.avgScore}</p>
        <p><strong>Topper:</strong> ${
          test.topper
            ? `${test.topper.name} (${test.topper.score})`
            : "—"
        }</p>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    alert("Failed to load analytics");
    console.error(err);
  }
}

// INIT
loadStudentStats();
loadAnalytics();
