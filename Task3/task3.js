require("dotenv").config();

const express = require("express");
const path = require("path");
const Groq = require("groq-sdk");
const { z } = require("zod");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const UserProfile = z.object({
  name: z.string().trim().min(1, "Name is required"),
  age: z.number().int().min(18).max(120),
  email: z.string().trim().email("Invalid email address"),
  pan: z.string().trim().toUpperCase().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN format"),
});

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

app.post("/profiles/generate", async (req, res) => {
  const { description } = req.body ?? {};

  if (typeof description !== "string" || !description.trim()) {
    return res.status(400).json({ error: "A profile description is required" });
  }

  if (description.length > 4000) {
    return res.status(400).json({ error: "Description must be 4000 characters or fewer" });
  }

  if (!groq) {
    return res.status(500).json({
      error: "GROQ_API_KEY is not configured. Add it to your .env file.",
    });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            "Extract the user profile from the supplied description. Do not invent or guess any values. Return only the profile fields.",
        },
        { role: "user", content: description.trim() },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "user_profile",
          strict: true,
          schema: z.toJSONSchema(UserProfile),
        },
      },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return res.status(502).json({ error: "The LLM returned an empty response" });
    }

    const rawContent = Array.isArray(content)
      ? content.map((part) => (typeof part?.text === "string" ? part.text : "")).join("")
      : typeof content === "string"
        ? content
        : JSON.stringify(content);

    const sanitizedContent = rawContent.trim();
    const jsonContent = sanitizedContent.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();

    let profile;
    try {
      profile = UserProfile.parse(JSON.parse(jsonContent));
    } catch (error) {
      if (error instanceof SyntaxError || error instanceof z.ZodError) {
        console.error("Groq returned a profile that failed validation:", error.message);
        return res.status(502).json({
          error: "The LLM response did not match the User Profile schema",
        });
      }
      throw error;
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Groq API error:", error.message);
    return res.status(502).json({ error: "Failed to generate a user profile" });
  }
});

const port = Number(process.env.PORT) || 3003;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
