const classSelect = document.getElementById("classSelect");
const tabs = document.querySelectorAll(".tab");
const container = document.getElementById("questions");

let currentType = "unanswered";

tabs.forEach(tab => {
  tab.onclick = () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentType = tab.dataset.type;
    load();
  };
});

classSelect.onchange = load;

async function load() {
  if (!classSelect.value) return;

  const res = await fetch(
    `/api/questions/class/${classSelect.value}`,
    { headers: { Authorization: localStorage.getItem("token") } }
  );

  const data = await res.json();
  container.innerHTML = "";

  const arr = currentType === "answered"
    ? data.answered
    : data.unanswered;

  arr.forEach(q => {
    container.innerHTML += `
      <div class="card">
        <p><strong>${q.studentName}</strong></p>
        <p>❓ ${q.question}</p>

        ${currentType === "unanswered" ? `
          <textarea id="a${q._id}"></textarea>
          <button onclick="answer('${q._id}')">Answer</button>
        ` : `
          <p><strong>Answer:</strong> ${q.answer}</p>
        `}
      </div>
    `;
  });
}

async function answer(id) {
  const text = document.getElementById(`a${id}`).value;

  await fetch(`/api/questions/answer/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    },
    body: JSON.stringify({ answer: text })
  });

  load();
}
