// ===== UTILITIES =====
const throttle = (func, delay) => {
  let timeoutId,
    lastExecTime = 0;
  return function (...args) {
    const elapsed = Date.now() - lastExecTime;
    clearTimeout(timeoutId);
    if (elapsed > delay) {
      func.apply(this, args);
      lastExecTime = Date.now();
    } else {
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - elapsed);
    }
  };
};

// ===== TYPING ANIMATION =====
function initTyping() {
  const textEl = document.querySelector("header p span:not([data-cursor])");
  const cursorEl = document.querySelector("header p span[data-cursor]");
  if (!textEl || !cursorEl) return;

  const phrases = [
    "Debugging ideas",
    "Dodging merge conflicts",
    "Branching hypotheses",
    "Refactoring bugs",
    "Collecting knowledge",
    "Dereferencing pointers",
  ];

  let phraseIndex = 0,
    charIndex = 0,
    isDeleting = false;

  cursorEl.style.display = "inline";

  function type() {
    const phrase = phrases[phraseIndex];
    charIndex += isDeleting ? -1 : 1;

    if (!isDeleting && charIndex > phrase.length) {
      setTimeout(() => {
        isDeleting = true;
        type();
      }, 2000);
      return;
    }
    if (isDeleting && charIndex < 0) {
      charIndex = 0;
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 500);
      return;
    }

    textEl.textContent = phrase.substring(0, charIndex);
    setTimeout(type, isDeleting ? 25 : 50);
  }

  setTimeout(type, 1000);
}

// ===== NAVIGATION HIGHLIGHTER =====
function initNavHighlighter() {
  const sections = [];
  let threshold = window.innerHeight * 0.3;

  document.querySelectorAll("aside nav a").forEach((link) => {
    const href = link.getAttribute("href");
    let element = null;
    let isSummary = false;

    if (href === "#") {
      element = document.body;
      isSummary = true;
    } else if (href?.startsWith("#")) {
      element = document.getElementById(href.substring(1));
    }

    if (element) sections.push({ link, element, isSummary });
  });

  if (!sections.length) return;

  function update() {
    const scrollTop = window.pageYOffset;
    let active = null;

    if (scrollTop < threshold) {
      active = sections.find((s) => s.isSummary);
    } else {
      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i];
        if (
          !s.isSummary &&
          s.element.getBoundingClientRect().top <= threshold
        ) {
          active = s;
          break;
        }
      }
    }

    sections.forEach((s) => {
      if (s === active) {
        s.link.setAttribute("data-active", "true");
      } else {
        s.link.removeAttribute("data-active");
      }
    });
  }

  window.addEventListener("scroll", throttle(update, 100), { passive: true });
  window.addEventListener(
    "resize",
    () => {
      threshold = window.innerHeight * 0.3;
      update();
    },
    { passive: true },
  );
  update();
}

// ===== SUMMARY LINK HANDLER =====
function initSummaryLink() {
  document
    .querySelector('aside nav a[href="#"]')
    ?.addEventListener("click", (e) => {
      e.preventDefault();
      window.history.replaceState(
        null,
        null,
        window.location.origin + window.location.pathname,
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// ===== BOOTSTRAP =====
window.addEventListener("load", () => {
  initSummaryLink();
  initTyping();
  initNavHighlighter();
});
