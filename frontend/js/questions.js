const tabs = document.querySelectorAll(".tab");
const sections = document.querySelectorAll(".tab-section");
const list = document.getElementById("questionsList");

tabs.forEach(tab => {
  tab.onclick = () => {
    tabs.forEach(t => t.classList.remove("active"));
    sections.forEach(s => s.classList.remove("active"));

    tab.classList.add("active");
    const target = tab.dataset.tab;

    if (target === "ask") {
      document.getElementById("ask").classList.add("active");
    } else {
      document.getElementById("list").classList.add("active");
      loadQuestions(target);
    }
  };
});

// ASK QUESTION
document.getElementById("askBtn").onclick = async () => {
  const text = document.getElementById("questionInput").value.trim();
  if (!text) return alert("Enter a question");

  await fetch("http://localhost:5000/api/questions/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    },
    body: JSON.stringify({
      question: text,
      className: localStorage.getItem("className")
    })
  });

  document.getElementById("questionInput").value = "";
  alert("Question submitted");
};

// LOAD QUESTIONS
async function loadQuestions(type) {
  const res = await fetch("http://localhost:5000/api/questions/my", {
    headers: { Authorization: localStorage.getItem("token") }
  });

  const data = await res.json();
  let arr = data.all;

  if (type === "answered") arr = data.answered;
  if (type === "pending") arr = data.pending;

  list.innerHTML = "";

  if (arr.length === 0) {
    list.innerHTML = "<p class='note'>No questions</p>";
    return;
  }

  arr.forEach(q => {
    list.innerHTML += `
      <div class="card">
        <p>❓ ${q.question}</p>
        ${
          q.answer
            ? `<p><strong>Answer:</strong> ${q.answer}</p>`
            : `<p class="note">⏳ Pending</p>`
        }
      </div>
    `;
  });
}
