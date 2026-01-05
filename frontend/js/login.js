document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");

  if (!loginBtn) {
    console.error("Login button not found");
    return;
  }

  loginBtn.addEventListener("click", async () => {
    const username = document.querySelector("input[placeholder='Username']").value;
    const password = document.querySelector("input[placeholder='Password']").value;
    const classSelect = document.querySelector("select");

    const params = new URLSearchParams(window.location.search);
    const role = params.get("role") || "student";

    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }

    if (role === "student" && (!classSelect || !classSelect.value)) {
      alert("Please select class");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Login failed");
        return;
      }

      // ✅ SAVE DATA
      localStorage.setItem("token", data.token);
      if (role === "student") {
        localStorage.setItem("className", classSelect.value);
        window.location.href = "dashboard.html";
      } else {
        window.location.href = "admin.html";
      }

    } catch (err) {
      console.error(err);
      alert("Server not reachable");
    }
  });
});
