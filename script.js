document.addEventListener("DOMContentLoaded", () => {
  const site = document.querySelector(".site");
  const contentPanel = document.querySelector(".content-panel");
  const tabs = document.querySelectorAll(".nav-tab");
  const panels = document.querySelectorAll(".panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const panelId = tab.dataset.panel;
      const panel = document.getElementById(panelId);
      if (!panel) return;

      site.classList.add("is-open");
      contentPanel.hidden = false;

      tabs.forEach((item) => item.classList.toggle("active", item === tab));
      panels.forEach((item) => item.classList.toggle("active", item === panel));
    });
  });
});
