document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Footer year ---------- */
  const yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- 2. Scroll progress bar + back-to-top button ---------- */
  const bar = document.getElementById("bar");
  const topBtn = document.getElementById("top-btn");

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (bar) bar.style.width = pct + "%";
    if (topBtn) topBtn.classList.toggle("show", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (topBtn) {
    topBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
    );
  }

  /* ---------- 3. Typing text in the hero ---------- */
  const words = ["SQL", "Power BI", "Tableau", "Excel", "R", "Python", "CRM"];
  const rot = document.getElementById("rot");

  if (rot && !reduceMotion) {
    let w = 0;      // which word
    let c = words[0].length; // how many letters are showing
    let deleting = true;     // start by deleting the first word

    function type() {
      const word = words[w];
      rot.textContent = word.slice(0, c);

      let delay = deleting ? 55 : 95;

      if (!deleting && c === word.length) {
        deleting = true;
        delay = 1400;               // pause when the word is complete
      } else if (deleting && c === 0) {
        deleting = false;
        w = (w + 1) % words.length; // move to next word
        delay = 300;
      } else {
        c += deleting ? -1 : 1;
      }
      setTimeout(type, delay);
    }
    setTimeout(type, 1800);
  }

  /* ---------- 4. Count-up numbers in the hero ---------- */
  const counters = document.querySelectorAll("[data-count]");

  function runCounter(el) {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // slows down at the end
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { runCounter(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(el => io.observe(el));
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- 5. Project filter ---------- */
  // Each button has data-f="Banking"; each project has data-cat="Banking".
  const chips = document.querySelectorAll(".chip");
  const projects = document.querySelectorAll(".proj");

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.f;

      chips.forEach(c => {
        c.classList.toggle("on", c === chip);
        c.setAttribute("aria-pressed", c === chip ? "true" : "false");
      });

      projects.forEach(p => {
        const show = filter === "All" || p.dataset.cat === filter;
        p.hidden = !show;
        if (show) {
          p.classList.remove("fade");
          void p.offsetWidth;          // restarts the animation
          p.classList.add("fade");
        }
      });
    });
  });

  /* ---------- 6. Highlight the nav link of the section on screen ---------- */
  const navLinks = document.querySelectorAll(".nav ul a");
  const sections = [...navLinks]
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(a =>
            a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
          );
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(s => spy.observe(s));
  }
});
