// 🔐 Auth protection
if (!localStorage.getItem("token")) {
  window.location.href = "index.html";
}

const questionsDiv = document.getElementById("questions");
const addQuestionBtn = document.getElementById("addQuestionBtn");
const createTestBtn = document.getElementById("createTestBtn");

let questions = [];

// ➕ Add Question UI
addQuestionBtn.onclick = () => {
  const index = questions.length;

  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <label>Question</label>
    <input id="q${index}" placeholder="Enter question"/>

    <label>Options</label>
    <input id="q${index}o0" placeholder="Option A"/>
    <input id="q${index}o1" placeholder="Option B"/>
    <input id="q${index}o2" placeholder="Option C"/>
    <input id="q${index}o3" placeholder="Option D"/>

    <label>Correct Option (0–3)</label>
    <input type="number" min="0" max="3" id="q${index}c"/>
  `;

  questionsDiv.appendChild(div);
  questions.push(index);
};

// 🚀 Create Test
createTestBtn.onclick = async () => {
  const className = document.getElementById("className").value;
  const title = document.getElementById("title").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;
  const duration = Number(document.getElementById("duration").value);

if (!duration || duration <= 0) {
  alert("Enter valid test duration");
  return;
}


  if (!className || !title || !startTime || !endTime) {
    alert("Fill all test details");
    return;
  }

  const formattedQuestions = [];

  questions.forEach(i => {
    const q = document.getElementById(`q${i}`).value;
    const options = [
      document.getElementById(`q${i}o0`).value,
      document.getElementById(`q${i}o1`).value,
      document.getElementById(`q${i}o2`).value,
      document.getElementById(`q${i}o3`).value
    ];
    const correct = Number(document.getElementById(`q${i}c`).value);

    if (!q || options.some(o => !o) || isNaN(correct)) return;
    formattedQuestions.push({ question: q, options, correct });
  });

  if (formattedQuestions.length === 0) {
    alert("Add at least one valid question");
    return;
  }

  const res = await fetch("http://localhost:5000/api/tests/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token")
    },
    body: JSON.stringify({
      className,
      title,
      startTime,
      endTime,
      duration,
      questions: formattedQuestions
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.msg || "Failed to create test");
    return;
  }

  alert("Test created successfully!");
  window.location.reload();
};
