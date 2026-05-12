const PASSWORD = "подсолнух";

const passwordGate = document.querySelector("#passwordGate");
const passwordForm = document.querySelector("#passwordForm");
const passwordInput = document.querySelector("#passwordInput");
const passwordError = document.querySelector("#passwordError");
const experience = document.querySelector(".experience");

function unlockExperience() {
  passwordGate.classList.add("password-gate-hidden");
  experience.classList.remove("experience-locked");
}

passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = passwordInput.value.trim().toLocaleLowerCase("ru-RU");

  if (value === PASSWORD) {
    passwordError.textContent = "";
    unlockExperience();
    return;
  }

  passwordError.textContent = "Не совсем. Попробуй ещё раз.";
  passwordInput.select();
});
