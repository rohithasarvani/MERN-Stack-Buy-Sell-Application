const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ reply: "Message cannot be empty." });
  }

  try {
    const geminiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        contents: [{ role: "user", parts: [{ text: message }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: { key: process.env.GEMINI_API_KEY },
      }
    );

    if (
      geminiResponse.data &&
      geminiResponse.data.candidates &&
      geminiResponse.data.candidates.length > 0
    ) {
      res.json({ reply: geminiResponse.data.candidates[0].content.parts[0].text });
    } else {
      res.json({ reply: "No response from AI. Please try again later." });
    }
  } catch (error) {
    console.error("Error fetching AI response:", error.response?.data || error.message);
    res.status(500).json({ reply: "Support is currently unavailable. Please try again later." });
  }
});

module.exports = router;
