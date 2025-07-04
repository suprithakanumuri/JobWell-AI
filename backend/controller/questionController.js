// ✅ UPDATED: questionController.js

const Question = require('../modals/Question');
const Session = require('../modals/Session');

// Add questions to a session
exports.addQuestionsToSession = async (req, res) => {
  try {
    const { sessionId, questions } = req.body;

    console.log('🟢 addQuestionsToSession called with:', { sessionId, questions });

    if (!sessionId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const createdQuestions = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer || '',
        note: q.note || '',
        isPinned: q.isPinned || false,
      }))
    );

    session.questions.push(...createdQuestions.map((q) => q._id));
    await session.save();

    const updatedSession = await Session.findById(sessionId).populate('questions');
    console.log('🟢 Updated session after adding questions:', updatedSession);

    res.status(201).json(createdQuestions);
  } catch (error) {
    console.error('Error in addQuestionsToSession:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle pin on a question
exports.togglePinQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.isPinned = !question.isPinned;
    await question.save();

    res.status(200).json({ success: true, question });
  } catch (error) {
    console.error('Error in togglePinQuestion:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ UPDATED: update note in a question
exports.updateQuestionNote = async (req, res) => {
  try {
    const { note } = req.body;

    if (typeof note !== 'string') {
      return res.status(400).json({ message: 'Note must be a string' });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.note = note.trim();
    await question.save();

    res.status(200).json({ success: true, question });
  } catch (error) {
    console.error('Error in updateQuestionNote:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
