document.addEventListener("DOMContentLoaded", () => {
  initCanvas();
  initTheme();
  initExpandables();
  initShowMore();
});

function initCanvas() {
  const canvas = document.getElementById("artCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = window.innerWidth;
  let height = window.innerHeight;
  let tasks = [];
  let running = [];

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    start();
  };

  const branch = (x, y, angle, depth = { value: 0 }) => {
    depth.value += 1;
    const len = 6 * Math.random();
    const nx = x + len * Math.cos(angle);
    const ny = y + len * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(nx, ny);
    ctx.stroke();

    const left = angle + Math.random() * (Math.PI / 12);
    const right = angle - Math.random() * (Math.PI / 12);

    if (nx < -100 || nx > width + 100 || ny < -100 || ny > height + 100) return;

    const chance = depth.value <= 30 ? 0.8 : 0.5;
    if (Math.random() < chance) tasks.push(() => branch(nx, ny, left, depth));
    if (Math.random() < chance) tasks.push(() => branch(nx, ny, right, depth));
  };

  const tick = () => {
    running = tasks;
    tasks = [];
    running.forEach((task) => {
      if (Math.random() < 0.5) tasks.push(task);
      else task();
    });
    requestAnimationFrame(tick);
  };

  const start = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(136, 136, 136, 0.15)";
    tasks = [
      () => branch(Math.random() * width, -5, Math.PI / 2),
      () => branch(Math.random() * width, height + 5, -Math.PI / 2),
      () => branch(-5, Math.random() * height, 0),
      () => branch(width + 5, Math.random() * height, Math.PI),
    ];
    if (width < 500) tasks = tasks.slice(0, 2);
    requestAnimationFrame(tick);
  };

  resize();
  window.addEventListener("resize", resize);
}

function initTheme() {
  const themeBtn = document.getElementById("themeToggle");
  const themeSelect = document.getElementById("themeSelect");
  const savedTheme = localStorage.getItem("data-theme") || "red";
  const savedMode = localStorage.getItem("theme");

  document.documentElement.setAttribute("data-theme", savedTheme);
  if (themeSelect) themeSelect.value = savedTheme;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = savedMode ? savedMode === "dark" : prefersDark;
  document.documentElement.classList.toggle("dark", isDark);
  if (themeBtn) themeBtn.textContent = isDark ? "☀️" : "🌙";

  themeBtn?.addEventListener("click", () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    themeBtn.textContent = next ? "☀️" : "🌙";
  });

  themeSelect?.addEventListener("change", (event) => {
    const value = event.target.value;
    document.documentElement.setAttribute("data-theme", value);
    localStorage.setItem("data-theme", value);
  });
}

function initExpandables() {
  document.querySelectorAll(".show-more[data-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.target);
      if (!target) return;
      const expanded = target.classList.toggle("expanded");
      button.textContent = expanded ? "Show less" : "Show more";
    });
  });
}

function initShowMore() {
  const button = document.getElementById("showMoreExperience");
  const hiddenItems = document.querySelectorAll(".experience-hidden");

  button?.addEventListener("click", () => {
    const showing = button.dataset.showing === "true";
    hiddenItems.forEach((item) => item.classList.toggle("visible", !showing));
    button.dataset.showing = showing ? "false" : "true";
    button.textContent = showing ? "Show more experiences" : "Show less experiences";
  });
}
