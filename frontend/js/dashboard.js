// 🔐 Auth protection
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// 🔓 Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.onclick = () => {
    localStorage.clear();
    window.location.href = "index.html";
  };
}

// 🔄 Load tests by status
async function loadTests() {
  try {
    const res = await fetch("http://localhost:5000/api/tests/student/my-tests", {
      headers: {
        "Authorization": localStorage.getItem("token")
      }
    });

    const data = await res.json();

    renderTests("upcomingTests", data.upcoming, false);
    renderTests("liveTests", data.live, true);
    renderTests("attemptedTests", data.ended, false);

  } catch (err) {
    console.error(err);
    alert("Failed to load tests");
  }
}

// 🧱 Render test boxes
function renderTests(containerId, tests, canStart) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (!tests || tests.length === 0) {
    container.innerHTML = "<p>No tests</p>";
    return;
  }

  tests.forEach(test => {
    const div = document.createElement("div");
    div.className = "box clickable";

    div.innerHTML = `
      <p>${test.title}</p>
      <small>
        ${new Date(test.startTime).toLocaleString()} –
        ${new Date(test.endTime).toLocaleString()}
      </small>
    `;

    // 🔴 Only live tests can be started
    if (canStart) {
      div.onclick = () => {
        localStorage.setItem("testId", test._id);
        window.location.href = "test.html";
      };
    }

    container.appendChild(div);
  });
}

// 🚀 Init
loadTests();
