const WP_CODE = "McKenna"; // or whatever code you want
document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScroll();
  setupRevealAnimations();
  setupWeddingPartyModal();
  setupMobileNav();
});

/* Smooth scrolling for nav + hero buttons */
function setupSmoothScroll() {
  const triggers = document.querySelectorAll('a[href^="#"], [data-scroll-to]');

  triggers.forEach((el) => {
    el.addEventListener("click", (e) => {
      const targetSelector = el.getAttribute("href") || el.dataset.scrollTo;
      if (!targetSelector || !targetSelector.startsWith("#")) return;

      const target = document.querySelector(targetSelector);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* Reveal on scroll */
function setupRevealAnimations() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || revealEls.length === 0) {
    revealEls.forEach((el) => el.classList.add("in-view"));
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

  revealEls.forEach((el) => observer.observe(el));
}

/* Wedding Party modal + unlock logic */
function setupWeddingPartyModal() {
  const openBtn = document.getElementById("wp-open");
  const modal = document.getElementById("wp-modal");
  const closeBtn = modal?.querySelector(".modal-close");
  const submitBtn = document.getElementById("wp-submit");
  const input = document.getElementById("wp-code");
  const errorMsg = document.getElementById("wp-error");

  if (!openBtn || !modal || !closeBtn || !submitBtn || !input || !errorMsg) {
    return;
  }

  openBtn.addEventListener("click", () => {
    modal.classList.add("open");
    errorMsg.classList.add("hidden");
    input.value = "";
    input.focus();
  });

  const closeModal = () => modal.classList.remove("open");

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  submitBtn.addEventListener("click", handleCode);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleCode();
  });

  function handleCode() {
    if (input.value === WP_CODE) {
      document.querySelectorAll(".wp-schedule").forEach((el) => {
        el.style.display = "block";
      });
      errorMsg.classList.add("hidden");
      closeModal();
      openBtn.textContent = "Wedding Party Access Granted";
      openBtn.disabled = true;
    } else {
      errorMsg.classList.remove("hidden");
    }
  }
}

/* Mobile nav */
function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (!toggle || !navLinks) return;

  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}
