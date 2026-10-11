const form = document.querySelector("#profile-form");
const descriptionInput = document.querySelector("#description");
const characterCount = document.querySelector("#character-count");
const submitButton = document.querySelector("#submit-button");
const buttonLabel = document.querySelector(".button-label");
const resultSection = document.querySelector("#result-section");
const result = document.querySelector("#result");
const errorBox = document.querySelector("#error");

descriptionInput.addEventListener("input", () => {
  characterCount.textContent = `${descriptionInput.value.length} / 4000`;
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  resultSection.hidden = true;
  errorBox.hidden = true;
  submitButton.disabled = true;
  buttonLabel.textContent = "Generating profile…";

  try {
    const response = await fetch("/profiles/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: descriptionInput.value.trim() }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not generate the profile.");
    }

    result.textContent = JSON.stringify(data, null, 2);
    resultSection.hidden = false;
  } catch (error) {
    errorBox.textContent =
      error instanceof TypeError
        ? "Could not connect to the server. Check that Task 3 is running and try again."
        : error.message;
    errorBox.hidden = false;
  } finally {
    submitButton.disabled = false;
    buttonLabel.textContent = "Generate profile";
  }
});
