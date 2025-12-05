const WP_CODE = "McKenna"; // password for wedding party

document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScroll();
  setupRevealAnimations();
  setupWeddingPartyModal();
  setupMobileNav();
  setupPhotoCarousel();
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
      // show wedding-party-only rows inside existing day cards
      document.querySelectorAll(".wp-only").forEach((el) => {
        el.style.display = "grid";
      });

      // show inline extra label (Bridal Party to Peri)
      document.querySelectorAll(".wp-only-inline").forEach((el) => {
        el.style.display = "inline-block";
      });

      // show the Jan 1 wedding-party-only day card
      document.querySelectorAll(".wp-day-only").forEach((el) => {
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

function setupPhotoCarousel() {
  const track = document.querySelector(".photo-track");
  if (!track) return;

  const slides = Array.from(track.querySelectorAll(".photo-slide"));
  const dots = Array.from(document.querySelectorAll(".carousel-dot"));

  if (!slides.length) return;

  let index = 0;
  let autoTimer = null;

  // ----- core slide update -----
  function updateSlides() {
    slides.forEach((slide, i) => {
      slide.classList.remove("is-active", "is-prev", "is-next");
      if (i === index) {
        slide.classList.add("is-active");
      } else if (i === (index - 1 + slides.length) % slides.length) {
        slide.classList.add("is-prev");
      } else if (i === (index + 1) % slides.length) {
        slide.classList.add("is-next");
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  }
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goTo(i);
      startAuto();
    });
  });
  function goTo(newIndex) {
    index = (newIndex + slides.length) % slides.length;
    updateSlides();
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  function startAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(next, 5000);
  }

  // ----- dots: click to jump -----
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goTo(i);
      startAuto();
    });
  });

  // ----- drag / swipe to move slides -----
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  function getClientX(e) {
    if (e.touches && e.touches.length) return e.touches[0].clientX;
    return e.clientX;
  }

  function handleDown(e) {
    isDragging = true;
    startX = getClientX(e);
    currentX = startX;
  }

  function handleMove(e) {
    if (!isDragging) return;
    currentX = getClientX(e);
  }

  function handleUp() {
    if (!isDragging) return;
    const dx = currentX - startX;

    // swipe threshold in pixels
    if (Math.abs(dx) > 40) {
      if (dx < 0) {
        next();
      } else {
        prev();
      }
      startAuto();
    }

    isDragging = false;
  }

  // mouse
  track.addEventListener("mousedown", handleDown);
  window.addEventListener("mousemove", handleMove);
  window.addEventListener("mouseup", handleUp);

  // touch
  track.addEventListener("touchstart", handleDown, { passive: true });
  track.addEventListener("touchmove", handleMove, { passive: true });
  track.addEventListener("touchend", handleUp);

  // ----- init -----
  updateSlides();
  startAuto();
}
