const genAI = require("../utils/geminiClient");

// ✅ Generate Interview Questions
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions = 10 } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate ${numberOfQuestions} technical interview questions for a ${role} with ${experience} years of experience. Focus on the following topics: ${topicsToFocus}. Return ONLY a JSON array of questions, like this: ["Question 1", "Question 2", ...]. Do not include any explanation or formatting, just the JSON array.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text(); // ✅ await added here

    let questions = [];
    try {
      questions = JSON.parse(text);
      if (!Array.isArray(questions)) {
        throw new Error("Response is not an array");
      }
    } catch (err) {
      const match = text.match(/\[.*\]/s);
      if (match) {
        try {
          questions = JSON.parse(match[0]);
        } catch (e) {
          questions = [text];
        }
      } else {
        questions = [text];
      }
    }

    res.status(200).json({ questions });
  } catch (error) {
    console.error("❌ Error generating questions:", error);
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message || "Unexpected error occurred",
    });
  }
};

// ✅ Generate Concept Explanation
const generateConceptExplanation = async (req, res) => {
  try {
    const { concept } = req.body;

    if (!concept) {
      return res.status(400).json({ message: "Concept is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Explain the following interview question or concept in detail for a candidate. Provide a comprehensive, multi-paragraph answer suitable for interview preparation. Use clear language, examples, and structure the explanation for maximum understanding. The response should be at least two paragraphs, but longer if needed for clarity.\n\nQuestion/Concept: ${concept}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    res.status(200).json({ explanation: text });
  } catch (error) {
    console.error("Error generating explanation:", error);
    res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message || "Unexpected error occurred",
    });
  }
};

const generateShortAnswer = async (req, res) => {
  try {
    const { concept } = req.body;
    if (!concept) return res.status(400).json({ message: "Concept is required" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Explain the following concept in a simple and clear way for interview preparation. Keep the answer short and concise, no more than 10 lines:\n\n${concept}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    res.status(200).json({ answer: text });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate short answer", error: error.message });
  }
};

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
  generateShortAnswer,
};
