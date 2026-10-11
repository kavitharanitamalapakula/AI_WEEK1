# Task 1 - Groq + Node.js + Express AI App

This project is a simple Express API that sends a user question to Groq's LLM and returns the AI response.

## Prerequisites

- Node.js installed
- A free Groq account
- A Groq API key

## Step 1: Create a Groq account

1. Go to the Groq website and sign up for a free account.
2. Create your API key from the Groq dashboard.

## Step 2: Configure the API key locally

Create a `.env` file in this project folder with the following values:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b
PORT=3000
```

Replace `your_groq_api_key_here` with your actual key.

## Step 3: Install dependencies

```bash
npm install
```

## Step 4: Start the app

```bash
node task1.js
```

The server will run on:

- http://localhost:3000

## Step 5: Verify the LLM works

Open the browser or use a tool like curl to send a request:

```bash
curl -X POST http://localhost:3000/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"Hello! Please introduce yourself."}'
```

You should receive a JSON response like:

```json
{
  "answer": "Hello! I am an AI assistant..."
}
```

## Project structure

```text
Task1/
├── .env
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── task1.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── node_modules/
```

## Notes

- `.env` should not be committed to Git in real projects.
- `.env.example` is a template for other developers.
- The UI is a simple HTML/CSS/JS page connected to the Express backend.
