
const express = require("express");
const path = require("path");
const { z } = require("zod");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// User Profile Schema
const UserProfile = z.object({
    name: z.string().trim().min(1, "Name is required"),
    age: z.number().int().min(18).max(120),
    email: z.string().trim().email("Invalid email address"),
    pan: z.string().trim().toUpperCase().regex(
        /^[A-Z]{5}[0-9]{4}[A-Z]$/,
        "Invalid PAN format"
    ),
});

// API endpoint
app.post("/users", (req, res) => {
    const result = UserProfile.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }

    return res.status(200).json({
        message: "User profile is valid",
        user: result.data,
    });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
