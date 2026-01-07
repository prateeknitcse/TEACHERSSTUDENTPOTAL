// 🔐 Auth protection
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

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
    loadStudents();
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
        <button class="btn outline" onclick="updateStudent('${s._id}')">Save</button>
        <button class="btn" onclick="deleteStudent('${s._id}')">Delete</button>
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
