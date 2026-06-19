document.addEventListener("DOMContentLoaded", () => {
  const site = document.querySelector(".site");
  const contentPanel = document.querySelector(".content-panel");
  const landingInner = document.querySelector(".landing-inner");
  const tabs = document.querySelectorAll(".nav-tab");
  const panels = document.querySelectorAll(".panel");

  const OPEN_DURATION = 1800;
  const TAB_FADE_MS = 350;
  const OPEN_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

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

  function openSite(panel, tab) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const first = landingInner.getBoundingClientRect();

    site.classList.add("is-open", "is-opening");
    contentPanel.hidden = false;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!reducedMotion && landingInner) {
          const last = landingInner.getBoundingClientRect();
          const dx = first.left - last.left;
          const dy = first.top - last.top;

          if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            landingInner.classList.add("is-flipping");
            const animation = landingInner.animate(
              [
                { transform: `translate(${dx}px, ${dy}px)` },
                { transform: "translate(0, 0)" },
              ],
              {
                duration: OPEN_DURATION,
                easing: OPEN_EASING,
                fill: "both",
              }
            );

            animation.onfinish = () => {
              landingInner.classList.remove("is-flipping");
              landingInner.style.transform = "";
            };
          }
        }

        window.setTimeout(() => {
          contentPanel.classList.add("is-visible");
        }, OPEN_DURATION * 0.5);

        window.setTimeout(() => {
          activatePanel(panel, tab);
        }, OPEN_DURATION * 0.62);

        window.setTimeout(() => {
          site.classList.remove("is-opening");
        }, OPEN_DURATION + 250);
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
