// Wedding Party Access Code
const WP_CODE = "LP2026"; // you can change this anytime

const loginBtn = document.getElementById("wp-login-btn");
const loginBox = document.getElementById("wp-login-box");
const submitBtn = document.getElementById("wp-submit");
const codeInput = document.getElementById("wp-code");
const errorMsg = document.getElementById("wp-error");

// Show login box
loginBtn.addEventListener("click", () => {
  loginBox.classList.toggle("hidden");
});

// Check code
submitBtn.addEventListener("click", () => {
  if (codeInput.value === WP_CODE) {
    document.querySelectorAll(".wp-only").forEach((item) => {
      item.style.display = "list-item";
    });
    loginBox.style.display = "none";
    loginBtn.textContent = "Wedding Party Access Granted";
    loginBtn.disabled = true;
  } else {
    errorMsg.classList.remove("hidden");
  }
});
