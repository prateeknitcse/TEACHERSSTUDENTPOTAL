// 🔐 Auth protection
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// 🚫 IMPORTANT: clear any stale test state
localStorage.removeItem("testId");
localStorage.removeItem("selectedTestId");

// 🔓 Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.onclick = () => {
    localStorage.clear();
    window.location.href = "index.html";
  };
}
