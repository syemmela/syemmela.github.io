document.addEventListener("DOMContentLoaded", () => {
  const site = document.querySelector(".site");
  const contentPanel = document.querySelector(".content-panel");
  const tabs = document.querySelectorAll(".nav-tab");
  const panels = document.querySelectorAll(".panel");

  const OPEN_ANIM_MS = 1200;
  const TAB_FADE_MS = 350;

  function animatePanel(panel, mode) {
    panel.classList.remove("panel-animate", "panel-animate-open", "panel-animate-switch");
    void panel.offsetWidth;
    panel.classList.add("panel-animate", mode);
  }

  function activatePanel(panel, tab) {
    tabs.forEach((item) => item.classList.toggle("active", item === tab));
    panels.forEach((item) => {
      item.classList.toggle("active", item === panel);
      item.classList.remove("panel-leaving");
    });
    animatePanel(panel, site.classList.contains("is-opening") ? "panel-animate-open" : "panel-animate-switch");
  }

  function showPanel(panel, tab) {
    const isFirstOpen = !site.classList.contains("is-open");
    const currentPanel = document.querySelector(".panel.active");

    if (isFirstOpen) {
      site.classList.add("is-open", "is-opening");
      contentPanel.hidden = false;

      window.requestAnimationFrame(() => {
        contentPanel.classList.add("is-visible");
      });

      activatePanel(panel, tab);

      window.setTimeout(() => {
        site.classList.remove("is-opening");
      }, OPEN_ANIM_MS);
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
