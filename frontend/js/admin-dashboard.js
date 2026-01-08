// 🔐 Auth guard
if (!localStorage.getItem("token")) {
  location.href = "index.html";
}

// 🔓 Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.onclick = () => {
    localStorage.clear();
    location.href = "index.html";
  };
}

// 📊 Load student stats
async function loadStudentStats() {
  try {
    const res = await fetch("http://localhost:5000/api/admin/students", {
      headers: { Authorization: localStorage.getItem("token") }
    });

    if (!res.ok) throw new Error("Unauthorized");

    const students = await res.json();

    const totalStudentsEl = document.getElementById("totalStudents");
    const classFilter = document.getElementById("classFilter");
    const classStudentsEl = document.getElementById("classStudents");

    totalStudentsEl.innerText = students.length;

    classFilter.onchange = () => {
      if (!classFilter.value) {
        classStudentsEl.innerText = "--";
        return;
      }

      const count = students.filter(
        s => s.className === classFilter.value
      ).length;

      classStudentsEl.innerText = count;
    };

  } catch (err) {
    console.error(err);
    alert("Failed to load student stats");
  }
}

// 🚀 INIT
loadStudentStats();
