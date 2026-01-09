const titleEl = document.getElementById("newsTitle");
const msgEl = document.getElementById("newsMessage");
const list = document.getElementById("newsList");

document.getElementById("publishBtn").onclick = async () => {
  const title = titleEl.value.trim();
  const message = msgEl.value.trim();

  if (!title || !message) {
    return alert("Fill all fields");
  }

  const res = await fetch("http://localhost:5000/api/news/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    },
    body: JSON.stringify({ title, message })
  });

  if (!res.ok) {
    alert("Failed to publish");
    return;
  }

  titleEl.value = "";
  msgEl.value = "";
  loadNews();
};

async function loadNews() {
  const res = await fetch("http://localhost:5000/api/news/all", {
    headers: { Authorization: localStorage.getItem("token") }
  });

  const data = await res.json();
  list.innerHTML = "";

  data.forEach(n => {
    list.innerHTML += `
      <div class="card">
        <h4>${n.title}</h4>
        <p>${n.message}</p>
        <small>${new Date(n.createdAt).toLocaleString()}</small>
      </div>
    `;
  });
}

loadNews();
