// 🔐 Auth protection
if (!localStorage.getItem("token")) {
  location.href = "login.html"; // ✅ FIXED
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
  const className = localStorage.getItem("className");

  const testsRes = await fetch(
    `http://localhost:5000/api/tests/class/${className}`,
    { headers: { Authorization: localStorage.getItem("token") } }
  );

  allTests = await testsRes.json();

  const resultRes = await fetch(
    "http://localhost:5000/api/results/my",
    { headers: { Authorization: localStorage.getItem("token") } }
  );

  const results = await resultRes.json();
  attemptedTestIds = results.map(r => r.testId);

  renderTests("unattempted");
}

function renderTests(type) {
  grid.innerHTML = ""; // ✅ ensure clean render
  const now = new Date();

  allTests.forEach(test => {
    const start = new Date(test.startTime);
    const end = new Date(test.endTime);
    const attempted = attemptedTestIds.includes(test._id);

    let status = null;

    // 🚫 Test not started yet → hide completely
    if (now < start) return;

    // ✅ Attempted overrides everything
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
      localStorage.setItem("testId", test._id); // ✅ unify key

      if (status === "live") {
        location.href = "test.html";
      } else {
        location.href = "test-details.html";
      }
    };

    grid.appendChild(card);
  });

  if (!grid.children.length) {
    grid.innerHTML = "<p class='note'>No tests</p>";
  }
}

loadData();
