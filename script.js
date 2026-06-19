document.addEventListener("DOMContentLoaded", () => {
  const site = document.querySelector(".site");
  const contentPanel = document.querySelector(".content-panel");
  const tabs = document.querySelectorAll(".nav-tab");
  const panels = document.querySelectorAll(".panel");

  function showPanel(panel, tab) {
    const isFirstOpen = !site.classList.contains("is-open");

    site.classList.add("is-open");
    contentPanel.hidden = false;

    tabs.forEach((item) => item.classList.toggle("active", item === tab));

    panels.forEach((item) => {
      const isTarget = item === panel;
      item.classList.toggle("active", isTarget);

      if (isTarget) {
        item.classList.remove("panel-animate");
        void item.offsetWidth;
        item.classList.add("panel-animate");
      } else {
        item.classList.remove("panel-animate");
      }
    });

    if (isFirstOpen) {
      window.requestAnimationFrame(() => {
        contentPanel.classList.add("is-visible");
      });
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const panel = document.getElementById(tab.dataset.panel);
      if (panel) showPanel(panel, tab);
    });
  });
});
