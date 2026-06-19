document.addEventListener("DOMContentLoaded", () => {
  const site = document.querySelector(".site");
  const sidebar = document.querySelector(".sidebar");
  const contentPanel = document.querySelector(".content-panel");
  const landingInner = document.querySelector(".landing-inner");
  const tabs = document.querySelectorAll(".nav-tab");
  const panels = document.querySelectorAll(".panel");

  const OPEN_DURATION = 2400;
  const TAB_FADE_MS = 350;
  const OPEN_EASING = "cubic-bezier(0.19, 1, 0.22, 1)";

  let isAnimatingOpen = false;

  function getSidebarWidthPx() {
    const value = getComputedStyle(document.documentElement).getPropertyValue("--sidebar-width").trim();
    if (value.endsWith("rem")) {
      return parseFloat(value) * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }
    return parseFloat(value) || 352;
  }

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
    animatePanel(panel, "panel-animate-open");
  }

  function openSite(panel, tab) {
    if (isAnimatingOpen) return;
    isAnimatingOpen = true;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      site.classList.add("is-open");
      contentPanel.hidden = false;
      contentPanel.classList.add("is-visible");
      activatePanel(panel, tab);
      isAnimatingOpen = false;
      return;
    }

    const start = landingInner.getBoundingClientRect();
    const sidebarWidth = getSidebarWidthPx();
    const targetWidth = Math.min(256, sidebarWidth - 64);
    const targetLeft = (sidebarWidth - targetWidth) / 2;
    const targetTop = (window.innerHeight - start.height * (targetWidth / start.width)) / 2;
    const scale = targetWidth / start.width;

    const flyer = landingInner.cloneNode(true);
    flyer.className = "landing-flyer";
    flyer.setAttribute("aria-hidden", "true");
    flyer.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
    });

    Object.assign(flyer.style, {
      left: `${start.left}px`,
      top: `${start.top}px`,
      width: `${start.width}px`,
    });

    const curtain = document.createElement("div");
    curtain.className = "sidebar-curtain";

    document.body.appendChild(curtain);
    document.body.appendChild(flyer);
    site.classList.add("is-opening");
    landingInner.classList.add("is-hidden-during-open");

    const deltaX = targetLeft - start.left;
    const deltaY = targetTop - start.top;

    const flyAnimation = flyer.animate(
      [
        { transform: "translate(0, 0) scale(1)" },
        { transform: `translate(${deltaX}px, ${deltaY}px) scale(${scale})` },
      ],
      {
        duration: OPEN_DURATION,
        easing: OPEN_EASING,
        fill: "forwards",
      }
    );

    const curtainAnimation = curtain.animate(
      [{ width: "0px" }, { width: `${sidebarWidth}px` }],
      {
        duration: OPEN_DURATION,
        easing: OPEN_EASING,
        fill: "forwards",
      }
    );

    const finishOpen = () => {
      site.classList.add("is-open");
      site.classList.remove("is-opening");
      landingInner.classList.remove("is-hidden-during-open");
      flyer.remove();
      curtain.remove();
      contentPanel.hidden = false;

      window.requestAnimationFrame(() => {
        contentPanel.classList.add("is-visible");
        activatePanel(panel, tab);
        isAnimatingOpen = false;
      });
    };

    Promise.all([
      flyAnimation.finished.catch(() => undefined),
      curtainAnimation.finished.catch(() => undefined),
    ]).then(finishOpen);
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
        tabs.forEach((item) => item.classList.toggle("active", item === tab));
        panels.forEach((item) => {
          item.classList.toggle("active", item === panel);
          item.classList.remove("panel-leaving");
        });
        animatePanel(panel, "panel-animate-switch");
      }, TAB_FADE_MS);
      return;
    }

    tabs.forEach((item) => item.classList.toggle("active", item === tab));
    panels.forEach((item) => item.classList.toggle("active", item === panel));
    animatePanel(panel, "panel-animate-switch");
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const panel = document.getElementById(tab.dataset.panel);
      if (panel) showPanel(panel, tab);
    });
  });
});
