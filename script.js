// Access code for wedding party events
const WP_CODE = "LP2026"; // change if you want

document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScroll();
  setupRevealAnimations();
  setupWeddingPartyModal();
  setupMobileNav();
});

/* -------------------------
   Smooth scrolling
------------------------- */
function setupSmoothScroll() {
  const scrollTriggers = document.querySelectorAll(
    'a[href^="#"], [data-scroll-to]'
  );

  scrollTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      const targetSelector =
        trigger.getAttribute("href") || trigger.dataset.scrollTo;
      if (!targetSelector || !targetSelector.startsWith("#")) return;

      const targetEl = document.querySelector(targetSelector);
      if (!targetEl) return;

      e.preventDefault();
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* -------------------------
   Reveal on scroll
------------------------- */
function setupRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || revealElements.length === 0) {
    revealElements.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* -------------------------
   Wedding Party modal + code
------------------------- */
function setupWeddingPartyModal() {
  const wpOpenBtn = document.getElementById("wp-open");
  const modal = document.getElementById("wp-modal");
  const closeBtn = modal?.querySelector(".modal-close");
  const submitBtn = document.getElementById("wp-submit");
  const input = document.getElementById("wp-code");
  const errorMsg = document.getElementById("wp-error");

  if (!wpOpenBtn || !modal || !closeBtn || !submitBtn || !input || !errorMsg) {
    return;
  }

  wpOpenBtn.addEventListener("click", () => {
    modal.classList.add("open");
    errorMsg.classList.add("hidden");
    input.value = "";
    input.focus();
  });

  const closeModal = () => {
    modal.classList.remove("open");
  };

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  submitBtn.addEventListener("click", () => handleCode());

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleCode();
    }
  });

  function handleCode() {
    if (input.value === WP_CODE) {
      document.querySelectorAll(".wp-only").forEach((el) => {
        // Display timeline items as grid rows again
        el.style.display = "grid";
      });
      errorMsg.classList.add("hidden");
      closeModal();
      wpOpenBtn.textContent = "Wedding Party Access Granted";
      wpOpenBtn.disabled = true;
    } else {
      errorMsg.classList.remove("hidden");
    }
  }
}

/* -------------------------
   Mobile navigation
------------------------- */
function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (!toggle || !navLinks) return;

  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  // Close on nav click (mobile)
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}
