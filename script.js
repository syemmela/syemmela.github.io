document.addEventListener("DOMContentLoaded", () => {
  const site = document.querySelector(".site");
  const contentPanel = document.querySelector(".content-panel");
  const tabs = document.querySelectorAll(".nav-tab");
  const panels = document.querySelectorAll(".panel");

  const TAB_FADE_MS = 350;

  function animatePanel(panel, mode) {
    panel.classList.remove("panel-animate", "panel-animate-open", "panel-animate-switch");
    void panel.offsetWidth;
    panel.classList.add("panel-animate", mode);
  }

  function activatePanel(panel, tab, mode = "panel-animate-switch") {
    tabs.forEach((item) => item.classList.toggle("active", item === tab));
    panels.forEach((item) => {
      item.classList.toggle("active", item === panel);
      item.classList.remove("panel-leaving");
    });
    animatePanel(panel, mode);
  }

  function openSite(panel, tab) {
    site.classList.add("is-open");
    contentPanel.hidden = false;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        contentPanel.classList.add("is-visible");
        activatePanel(panel, tab, "panel-animate-open");
      });
    });
  }

  function showPanel(panel, tab) {
    const isFirstOpen = !site.classList.contains("is-open");
    const currentPanel = document.querySelector(".panel.active");

    if (isFirstOpen) {
      openSite(panel, tab);
      return;
    }

    if (currentPanel === panel) return;

    if (currentPanel) {
      currentPanel.classList.add("panel-leaving");
      window.setTimeout(() => {
        activatePanel(panel, tab);
      }, TAB_FADE_MS);
      return;
    }

    activatePanel(panel, tab);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const panel = document.getElementById(tab.dataset.panel);
      if (panel) showPanel(panel, tab);
    });
  });
});
