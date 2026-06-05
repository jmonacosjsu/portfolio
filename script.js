/* =====================================================================
   Jacob Monaco — Portfolio interactions
   Progressive enhancement: everything degrades gracefully without JS.
   - marks <html> with .js so reveal styles only hide content when active
   - scroll-reveal via IntersectionObserver
   - click-to-zoom lightbox for project figures
   - back-to-top button
===================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const ready = (fn) =>
    document.readyState !== "loading"
      ? fn()
      : document.addEventListener("DOMContentLoaded", fn);

  ready(function () {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /* ---------- Scroll reveal ---------- */
    const revealTargets = document.querySelectorAll(
      ".hero-section, .featured-section, .feature-card, .figure, .table-wrap, pre"
    );
    revealTargets.forEach((el) => el.classList.add("reveal"));

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach((el) => el.classList.add("is-visible"));
    } else {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      revealTargets.forEach((el) => io.observe(el));
    }

    /* ---------- Lightbox ---------- */
    // Any content image inside a section is zoomable (skip nav logo & tiny logos).
    const zoomables = Array.from(
      document.querySelectorAll(".featured-section img, .figure img")
    ).filter((img) => !img.classList.contains("logo-img"));

    if (zoomables.length) {
      const lb = document.createElement("div");
      lb.className = "lightbox";
      lb.setAttribute("role", "dialog");
      lb.setAttribute("aria-modal", "true");
      lb.innerHTML =
        '<button class="lightbox-close" aria-label="Close">&times;</button>' +
        '<img alt="" />';
      document.body.appendChild(lb);

      const lbImg = lb.querySelector("img");

      const open = (src, alt) => {
        lbImg.src = src;
        lbImg.alt = alt || "";
        lb.classList.add("active");
        document.body.style.overflow = "hidden";
      };
      const close = () => {
        lb.classList.remove("active");
        document.body.style.overflow = "";
      };

      zoomables.forEach((img) => {
        img.classList.add("zoomable");
        img.addEventListener("click", () =>
          open(img.currentSrc || img.src, img.alt)
        );
      });

      lb.addEventListener("click", close);
      lb.querySelector(".lightbox-close").addEventListener("click", close);
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lb.classList.contains("active")) close();
      });
    }

    /* ---------- Back to top ---------- */
    const toTop = document.createElement("button");
    toTop.className = "to-top";
    toTop.type = "button";
    toTop.setAttribute("aria-label", "Back to top");
    toTop.innerHTML = "&uarr;";
    document.body.appendChild(toTop);

    toTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
    );

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        toTop.classList.toggle("show", window.scrollY > 600);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  });
})();
