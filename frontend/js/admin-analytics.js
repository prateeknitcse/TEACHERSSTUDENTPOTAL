async function loadAnalytics() {
  try {
    const res = await fetch(
      "http://localhost:5000/api/tests/analytics",
      {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }
    );

    const data = await res.json();
    const container = document.getElementById("analytics");

    container.innerHTML = "";

    data.forEach(test => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${test.title}</h3>
        <p><strong>Class:</strong> ${test.className}</p>
        <p><strong>Total Attempts:</strong> ${test.attempts}</p>
        <p><strong>Average Score:</strong> ${test.avgScore}</p>
        <p><strong>Topper:</strong> ${
          test.topper
            ? `${test.topper.name} (${test.topper.score})`
            : "No attempts yet"
        }</p>
      `;

      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    alert("Failed to load analytics");
  }
}

loadAnalytics();
