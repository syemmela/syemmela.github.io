document.addEventListener("DOMContentLoaded", () => {
  const site = document.querySelector(".site");
  const contentPanel = document.querySelector(".content-panel");
  const tabs = document.querySelectorAll(".nav-tab");
  const panels = document.querySelectorAll(".panel");

  function activatePanel(panel, tab) {
    tabs.forEach((item) => item.classList.toggle("active", item === tab));
    panels.forEach((item) => item.classList.toggle("active", item === panel));
  }

  function openSite(panel, tab) {
    site.classList.add("is-open");
    contentPanel.hidden = false;
    activatePanel(panel, tab);
  }

  function showPanel(panel, tab) {
    if (!site.classList.contains("is-open")) {
      openSite(panel, tab);
      return;
    }

    if (document.querySelector(".panel.active") === panel) return;

    activatePanel(panel, tab);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const panel = document.getElementById(tab.dataset.panel);
      if (panel) showPanel(panel, tab);
    });
  });
});
