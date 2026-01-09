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
async function loadNews() {
  const res = await fetch("http://localhost:5000/api/news/all", {
    headers: { Authorization: localStorage.getItem("token") }
  });

  const news = await res.json();
  const container = document.getElementById("newsContainer");

  container.innerHTML = "";

  if (news.length === 0) {
    container.innerHTML = "<p class='note'>No announcements</p>";
    return;
  }

  news.forEach(n => {
  container.innerHTML += `
    <div class="news-card">
      <div class="news-badge">NEW</div>
      <h4>${n.title}</h4>
      <p>${n.message}</p>
      <div class="news-meta">
        <span>By ${n.createdBy || "Admin"}</span>
        <span>${new Date(n.createdAt).toLocaleString()}</span>
      </div>
    </div>
  `;
});

}

loadNews();

