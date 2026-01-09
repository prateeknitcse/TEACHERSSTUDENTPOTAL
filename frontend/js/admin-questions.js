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
    `http://localhost:5000/api/questions/class/${classSelect.value}`,
    { headers: { Authorization: localStorage.getItem("token") } }
  );

  const data = await res.json();
  container.innerHTML = "";

  const arr =
    currentType === "answered" ? data.answered : data.unanswered;

  if (arr.length === 0) {
    container.innerHTML = "<p class='note'>No questions</p>";
    return;
  }

  arr.forEach(q => {
    container.innerHTML += `
      <div class="card">
        <p><strong>${q.studentName}</strong></p>
        <p>❓ ${q.question}</p>

        ${
          currentType === "unanswered"
            ? `
            <textarea id="a${q._id}" placeholder="Type answer..."></textarea>
            <button class="btn" onclick="answer('${q._id}')">Submit</button>
          `
            : `<p><strong>Answer:</strong> ${q.answer}</p>`
        }
      </div>
    `;
  });
}

async function answer(id) {
  const text = document.getElementById(`a${id}`).value.trim();
  if (!text) return alert("Write answer");

  await fetch(`http://localhost:5000/api/questions/answer/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    },
    body: JSON.stringify({ answer: text })
  });

  load();
}
