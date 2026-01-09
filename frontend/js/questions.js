document.addEventListener("DOMContentLoaded", () => {

  const tabs = document.querySelectorAll(".tab");
  const sections = document.querySelectorAll(".tab-content");
  const askBtn = document.getElementById("submitQuestion");
  const input = document.getElementById("questionInput");

  const list = document.getElementById("questionsList"); // ✅ FIX
  let lastTab = "your";

  // TAB SWITCHING
  tabs.forEach(tab => {
    tab.onclick = () => {
      tabs.forEach(t => t.classList.remove("active"));
      sections.forEach(s => s.classList.remove("active"));

      tab.classList.add("active");
      const target = tab.dataset.tab;
      lastTab = target;

      // ✅ Only two sections exist: ask & list
      if (target === "ask") {
        document.getElementById("ask").classList.add("active");
      } else {
        document.getElementById("list").classList.add("active");
        loadQuestions(target);
      }
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

      // switch to "Your Questions"
      document.querySelector('[data-tab="your"]').click();

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // LOAD QUESTIONS
  async function loadQuestions(type) {
    const res = await fetch("http://localhost:5000/api/questions/my", {
      headers: { Authorization: localStorage.getItem("token") }
    });

    const data = await res.json();

    // badges
    document.querySelector('[data-tab="answered"]').innerHTML =
      `Answered <span class="badge">${data.answered.length}</span>`;

    document.querySelector('[data-tab="pending"]').innerHTML =
      `Pending <span class="badge">${data.pending.length}</span>`;

    let arr = data.all;
    if (type === "answered") arr = data.answered;
    if (type === "pending") arr = data.pending;
    if (type === "your") arr = data.all;

    list.innerHTML = "";

    if (!arr || arr.length === 0) {
      list.innerHTML = "<p class='note'>No questions</p>";
      return;
    }

    arr.forEach(q => {
      list.innerHTML += `
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
