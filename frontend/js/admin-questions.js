const classSelect = document.getElementById("classSelect");
const container = document.getElementById("questions");
const tabs = document.querySelectorAll(".tab");

let currentTab = "asked";
let cache = { asked: [], answered: [] };

tabs.forEach(tab => {
  tab.onclick = () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentTab = tab.dataset.tab;
    render();
  };
});

classSelect.onchange = loadQuestions;

async function loadQuestions() {
  if (!classSelect.value) return;

  const res = await fetch(
    `http://localhost:5000/api/questions/admin/${classSelect.value}`,
    { headers: { Authorization: localStorage.getItem("token") } }
  );

  cache = await res.json();
  document.getElementById("askedCount").innerText = cache.asked.length;
  document.getElementById("answeredCount").innerText = cache.answered.length;

  render();
}

function render() {
  container.innerHTML = "";

  const list = cache[currentTab];
  if (list.length === 0) {
    container.innerHTML = "<p class='note'>No questions</p>";
    return;
  }

  list.forEach(q => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <p><strong>${q.studentId.name}</strong></p>
      <p>❓ ${q.question}</p>
      ${
        currentTab === "asked"
          ? `
            <textarea placeholder="Type answer..." id="a-${q._id}"></textarea>
            <button class="btn" onclick="answer('${q._id}')">Submit</button>
          `
          : `<p><strong>Answer:</strong> ${q.answer}</p>`
      }
    `;

    container.appendChild(div);
  });
}

async function answer(id) {
  const text = document.getElementById(`a-${id}`).value.trim();
  if (!text) return alert("Write answer");

  await fetch(`http://localhost:5000/api/questions/answer/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    },
    body: JSON.stringify({ answer: text })
  });

  loadQuestions();
}
