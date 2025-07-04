const express = require("express");
const router = express.Router();
const {
  generateInterviewQuestions,
  generateConceptExplanation,
  generateShortAnswer,
} = require("../controller/aiController");

router.post("/generate-questions", generateInterviewQuestions);
router.post("/generate-explanation", generateConceptExplanation);
router.post("/generate-short-answer", generateShortAnswer);

module.exports = router;
