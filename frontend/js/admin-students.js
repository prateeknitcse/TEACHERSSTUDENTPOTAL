// 🔐 Auth guard
if (!localStorage.getItem("token")) {
  location.href = "index.html";
}

let allStudents = [];
let filteredStudents = [];
let currentPage = 1;
const PAGE_SIZE = 10;

// 👨‍🎓 Add Student
const addStudentBtn = document.getElementById("addStudentBtn");
const studentInfo = document.getElementById("studentInfo");

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
      Authorization: localStorage.getItem("token")
    },
    body: JSON.stringify({ name, className })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.msg || "Failed");
    return;
  }

  studentInfo.innerHTML = `
    ✅ Student added<br>
    <strong>${data.username}</strong> / ${data.password}
  `;

  document.getElementById("studentName").value = "";
  loadStudents();
};

// 👥 Load students
async function loadStudents() {
  const res = await fetch("http://localhost:5000/api/admin/students", {
    headers: { Authorization: localStorage.getItem("token") }
  });

  allStudents = await res.json();
  filteredStudents = allStudents;
  currentPage = 1;
  render();
}

// 🔍 Render table + pagination
function render() {
  renderTable();
  renderPagination();
}

// 📄 Render table
function renderTable() {
  const tbody = document.getElementById("studentsTable");
  tbody.innerHTML = "";

  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageData = filteredStudents.slice(start, end);

  pageData.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input value="${s.name}" id="name-${s._id}"></td>
      <td>${s.username}</td>
      <td><input value="${s.className}" id="class-${s._id}"></td>
      <td>
        <button class="btn outline" onclick="updateStudent('${s._id}')">Save</button>
        <button class="btn" onclick="deleteStudent('${s._id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 📑 Render pagination
function renderPagination() {
  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);
  const container = document.getElementById("pagination");
  container.innerHTML = "";

  if (totalPages <= 1) return;

  const prev = document.createElement("button");
  prev.className = "btn outline";
  prev.innerText = "Prev";
  prev.disabled = currentPage === 1;
  prev.onclick = () => {
    currentPage--;
    render();
  };
  container.appendChild(prev);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "btn outline";
    btn.innerText = i;
    if (i === currentPage) btn.style.fontWeight = "bold";

    btn.onclick = () => {
      currentPage = i;
      render();
    };
    container.appendChild(btn);
  }

  const next = document.createElement("button");
  next.className = "btn outline";
  next.innerText = "Next";
  next.disabled = currentPage === totalPages;
  next.onclick = () => {
    currentPage++;
    render();
  };
  container.appendChild(next);
}

// 🔍 Search & filter
document.getElementById("searchInput").oninput = applyFilters;
document.getElementById("classFilter").onchange = applyFilters;

function applyFilters() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const cls = document.getElementById("classFilter").value;

  filteredStudents = allStudents.filter(s => {
    const matchText =
      s.name.toLowerCase().includes(search) ||
      s.username.toLowerCase().includes(search);

    const matchClass = cls ? s.className === cls : true;
    return matchText && matchClass;
  });

  currentPage = 1;
  render();
}

// ✏️ Update
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

// 🗑 Delete
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
