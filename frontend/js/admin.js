// Auth protection
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.onclick = () => {
    localStorage.clear();
    window.location.href = "login.html";
  };
}
