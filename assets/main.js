(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- rotating role ---- */
  var roles = ["developer", "builder", "Python tinkerer", "Linux daily driver"];
  var roleEl = document.querySelector("[data-role]");
  if (roleEl && !reduced) {
    var i = 0;
    window.setInterval(function () {
      i = (i + 1) % roles.length;
      roleEl.textContent = roles[i];
      roleEl.style.animation = "none";
      void roleEl.offsetWidth;
      roleEl.style.animation = "";
    }, 2600);
  }

  /* ---- nav shadow + scrollspy ---- */
  var nav = document.querySelector(".nav");
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var sections = links
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function onScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 40);
    var probe = window.scrollY + window.innerHeight * 0.4;
    var current = sections[0];
    sections.forEach(function (section) {
      if (section.offsetTop <= probe) current = section;
    });
    links.forEach(function (link) {
      var match = current && link.getAttribute("href") === "#" + current.id;
      if (match) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- reveal on scroll ---- */
  var revealables = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) {
      el.classList.add("is-in");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "-60px 0px" }
    );
    revealables.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---- stat counters ---- */
  var counters = document.querySelectorAll("[data-count]");
  var duration = 1500;

  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduced) {
      el.textContent = String(target);
      return;
    }
    var start = null;
    function tick(now) {
      if (start === null) start = now;
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(eased * target));
      if (progress < 1) window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          co.unobserve(entry.target);
        });
      },
      { rootMargin: "-40px 0px" }
    );
    counters.forEach(function (el) {
      co.observe(el);
    });
  } else {
    counters.forEach(runCounter);
  }

  /* ---- year ---- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
