const rows = document.querySelectorAll(".leaderboard-row:not(.header)");

rows.forEach((row, i) => {
  row.style.animationDelay = `${i * 0.08}s`;
});
