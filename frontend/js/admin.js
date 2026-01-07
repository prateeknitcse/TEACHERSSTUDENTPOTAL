// 🔐 Auth protection
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// Logout
document.getElementById("logoutBtn").onclick = () => {
  localStorage.clear();
  window.location.href = "login.html";
};

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
// 👨‍🎓 Add Student
const addStudentBtn = document.getElementById("addStudentBtn");
const studentInfo = document.getElementById("studentInfo");

if (addStudentBtn) {
  addStudentBtn.onclick = async () => {
    const name = document.getElementById("studentName").value.trim();
    const className = document.getElementById("studentClass").value;

    if (!name) {
      alert("Enter student name");
      return;
    }

    const res = await fetch("http://localhost:5000/api/admin/add-student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      },
      body: JSON.stringify({ name, className })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || "Failed to add student");
      return;
    }

    studentInfo.innerHTML = `
      ✅ Student added<br/>
      <strong>Username:</strong> ${data.username}<br/>
      <strong>Password:</strong> ${data.password}
    `;

    document.getElementById("studentName").value = "";
  };
}
// 👥 Load students
async function loadStudents() {
  const res = await fetch("http://localhost:5000/api/admin/students", {
    headers: { Authorization: localStorage.getItem("token") }
  });

  const students = await res.json();
  const container = document.getElementById("students");
  container.innerHTML = "";

  students.forEach(s => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <input value="${s.name}" id="name-${s._id}"/>
      <input value="${s.className}" id="class-${s._id}"/>

      <div class="grid">
        <button class="btn outline" onclick="updateStudent('${s._id}')">
          Save
        </button>
        <button class="btn" onclick="deleteStudent('${s._id}')">
          Delete
        </button>
      </div>
    `;

    container.appendChild(div);
  });
}

// ✏️ Update student
async function updateStudent(id) {
  const name = document.getElementById(`name-${id}`).value;
  const className = document.getElementById(`class-${id}`).value;

  const res = await fetch(
    `http://localhost:5000/api/admin/students/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      },
      body: JSON.stringify({ name, className })
    }
  );

  const data = await res.json();
  alert(data.msg || "Updated");
}

// 🗑 Delete student
async function deleteStudent(id) {
  if (!confirm("Delete this student?")) return;

  const res = await fetch(
    `http://localhost:5000/api/admin/students/${id}`,
    {
      method: "DELETE",
      headers: { Authorization: localStorage.getItem("token") }
    }
  );

  const data = await res.json();
  alert(data.msg || "Deleted");
  loadStudents();
}

// INIT
loadStudents();

