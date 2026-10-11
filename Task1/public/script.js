const form = document.getElementById("ask-form");
const questionInput = document.getElementById("question");
const answerBox = document.getElementById("answer");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();
  if (!question) {
    answerBox.textContent = "Please enter a question.";
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Thinking...";
  answerBox.textContent = "Loading...";

  try {
    const response = await fetch("/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    answerBox.textContent = data.answer || "No answer returned.";
  } catch (error) {
    answerBox.textContent = error.message || "Failed to get answer.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Ask";
  }
});
