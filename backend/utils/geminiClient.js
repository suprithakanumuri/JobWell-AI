require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in .env");
}

const genAI = new GoogleGenerativeAI(apiKey);

module.exports = genAI; // ✅ This exports the instance correctly
