const express = require('express');
const {
  togglePinQuestion,
  updateQuestionNote,
  addQuestionsToSession,
} = require('../controller/questionController'); // ✅ Corrected spelling

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// POST: Add multiple questions to a session
router.post('/add', protect, addQuestionsToSession);

// PATCH: Toggle pin/unpin a question
router.patch('/:id/pin', protect, togglePinQuestion);

// PATCH: Update the note on a question
router.patch('/:id/note', protect, updateQuestionNote);

module.exports = router;
