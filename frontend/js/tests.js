// 🔐 Auth protection
if (!localStorage.getItem("token")) {
  location.href = "login.html";
}

const grid = document.getElementById("testsGrid");
const tabs = document.querySelectorAll(".tab");

let allTests = [];
let attemptedTestIds = [];

tabs.forEach(tab => {
  tab.onclick = () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    renderTests(tab.dataset.type);
  };
});

async function loadData() {
  // ✅ FIX: USE CORRECT API
  const testsRes = await fetch(
    "http://localhost:5000/api/tests/student/my-tests",
    { headers: { Authorization: localStorage.getItem("token") } }
  );

  const data = await testsRes.json();

  // ✅ FIX: merge buckets
  allTests = [...data.upcoming, ...data.live, ...data.ended];

  const resultRes = await fetch(
    "http://localhost:5000/api/results/my",
    { headers: { Authorization: localStorage.getItem("token") } }
  );

  const results = await resultRes.json();
  attemptedTestIds = results.map(r => r.testId);

  renderTests("unattempted");
}

function renderTests(type) {
  grid.innerHTML = "";
  const now = new Date();

  allTests.forEach(test => {
    const start = new Date(test.startTime);
    const end = new Date(test.endTime);
    const attempted = attemptedTestIds.includes(test._id);

    let status = null;

    // 🚫 upcoming hidden
    if (now < start) return;

    if (attempted) status = "attempted";
    else if (now >= start && now <= end) status = "live";
    else if (now > end) status = "unattempted";

    if (status !== type) return;

    const card = document.createElement("div");
    card.className = "box clickable";
    card.innerHTML = `
      <h3>${test.title}</h3>
      <p>${start.toLocaleString()} – ${end.toLocaleString()}</p>
    `;

    card.onclick = () => {
      localStorage.setItem("testId", test._id);
      if (status === "live") location.href = "test.html";
      else location.href = "test-details.html";
    };

    grid.appendChild(card);
  });

  if (!grid.children.length) {
    grid.innerHTML = "<p class='note'>No tests</p>";
  }
}

loadData();
