
require("dotenv").config();

const path = require("path");
const express = require("express");
const Groq = require("groq-sdk");

const app = express();
const publicPath = path.join(__dirname, "public");

app.use(express.static(publicPath));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

const groq = process.env.GROQ_API_KEY
  ? new Groq({
    apiKey: process.env.GROQ_API_KEY,
  })
  : null;

app.post("/ask", async (req, res) => {
  try {
    const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";

    if (!question) {
      return res.status(400).json({
        error: "Question is required",
      });
    }

    if (!groq) {
      return res.status(500).json({
        error: "GROQ_API_KEY is not configured. Add it to your .env file.",
      });
    }

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
    });

    const answer = completion.choices?.[0]?.message?.content;
    const text = Array.isArray(answer)
      ? answer.map((part) => (typeof part?.text === "string" ? part.text : "")).join("")
      : typeof answer === "string"
        ? answer
        : JSON.stringify(answer ?? "");

    res.json({
      answer: text,
    });
  } catch (error) {
    console.error("Groq API error:", error?.message || error);
    res.status(500).json({
      error: "Failed to get an AI response",
    });
  }
});

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
