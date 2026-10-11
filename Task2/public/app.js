const form = document.querySelector("#profile-form");
const submitButton = document.querySelector("#submit-button");
const resultBox = document.querySelector("#result");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  resultBox.hidden = true;

  const formData = new FormData(form);
  const profile = {
    name: formData.get("name").trim(),
    age: Number(formData.get("age")),
    email: formData.get("email").trim(),
    pan: formData.get("pan").trim().toUpperCase(),
  };

  submitButton.disabled = true;
  submitButton.textContent = "Validating…";

  try {
    const response = await fetch("/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });
    const data = await response.json();

    resultBox.className = `result ${response.ok ? "success" : "error"}`;
    resultBox.textContent = response.ok
      ? data.message
      : [
          data.message,
          ...(data.errors || []).map(({ field, message }) => `${field}: ${message}`),
        ].join("\n");
    resultBox.hidden = false;
  } catch {
    resultBox.className = "result error";
    resultBox.textContent =
      "Could not connect to the server. Make sure Task 2 is running and try again.";
    resultBox.hidden = false;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Validate profile";
  }
});
