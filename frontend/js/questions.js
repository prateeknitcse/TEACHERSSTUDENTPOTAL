const tabs = document.querySelectorAll(".tab");
const list = document.getElementById("questionsList");
const askSection = document.getElementById("askSection");

tabs.forEach(tab => {
  tab.onclick = () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    load(tab.dataset.type);
  };
});

document.getElementById("askBtn").onclick = async () => {
  const text = document.getElementById("questionInput").value;

  await fetch("/api/questions/ask", {
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

  alert("Question submitted");
  document.getElementById("questionInput").value = "";
};

async function load(type) {
  const res = await fetch("/api/questions/my", {
    headers: { Authorization: localStorage.getItem("token") }
  });

  const data = await res.json();

  let arr = type === "answered" ? data.answered :
            type === "pending" ? data.pending :
            data.all;

  askSection.style.display = type === "ask" ? "block" : "none";
  list.innerHTML = "";

  arr.forEach(q => {
    list.innerHTML += `
      <div class="card">
        <p>❓ ${q.question}</p>
        ${q.answer ? `<p><strong>Answer:</strong> ${q.answer}</p>` :
        `<p class="note">⏳ Pending</p>`}
      </div>
    `;
  });
}

load("ask");
