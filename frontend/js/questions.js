document.addEventListener("DOMContentLoaded", () => {

  const tabs = document.querySelectorAll(".tab");
  const sections = document.querySelectorAll(".tab-content");
  const askBtn = document.getElementById("submitQuestion");
  const input = document.getElementById("questionInput");

  const yourSection = document.getElementById("your");
  const answeredSection = document.getElementById("answered");
  const pendingSection = document.getElementById("pending");

  let lastTab = "your";

  // TAB SWITCHING
  tabs.forEach(tab => {
    tab.onclick = () => {
      tabs.forEach(t => t.classList.remove("active"));
      sections.forEach(s => s.classList.remove("active"));

      tab.classList.add("active");
      const target = tab.dataset.tab;
      lastTab = target;

      document.getElementById(target).classList.add("active");

      if (target !== "ask") loadQuestions(target);
    };
  });

  // ASK QUESTION
  askBtn.onclick = async () => {
    const text = input.value.trim();
    if (!text) return alert("Enter a question");

    try {
      const res = await fetch("http://localhost:5000/api/questions/ask", {
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

      if (!res.ok) {
        const err = await res.json();
        alert(err.msg || "Failed to submit");
        return;
      }

      input.value = "";
      alert("✅ Question submitted");

      // ✅ FIX: switch to "Your Questions" tab
      document.querySelector('[data-tab="your"]').click();

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // LOAD QUESTIONS
  // LOAD QUESTIONS
async function loadQuestions(type) {
  const res = await fetch("http://localhost:5000/api/questions/my", {
    headers: { Authorization: localStorage.getItem("token") }
  });

  const data = await res.json();

  // Badge counts
  document.querySelector('[data-tab="answered"]').innerHTML =
    `Answered <span class="badge">${data.answered.length}</span>`;

  document.querySelector('[data-tab="pending"]').innerHTML =
    `Pending <span class="badge">${data.pending.length}</span>`;

  let arr = data.all;

  if (type === "answered") arr = data.answered;
  if (type === "pending") arr = data.pending;
  if (type === "your") arr = data.all;

  const container = document.getElementById("questionsList");
  container.innerHTML = "";

  if (!arr || arr.length === 0) {
    container.innerHTML = "<p class='note'>No questions</p>";
    return;
  }

  arr.forEach(q => {
    container.innerHTML += `
      <div class="card">
        <p>❓ ${q.question}</p>
        ${
          q.isAnswered
            ? `<p><strong>Answer:</strong> ${q.answer}</p>`
            : `<p class="note">⏳ Pending</p>`
        }
      </div>
    `;
  });
}


  // 🔄 REAL-TIME REFRESH
  setInterval(() => {
    if (lastTab !== "ask") loadQuestions(lastTab);
  }, 10000);

});
