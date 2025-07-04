const Session = require("../modals/Session");
const Question = require("../modals/Question");

// @desc    Create a new session
// @route   POST /api/sessions/create
// @access  Private
const createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions } = req.body;
    const userId = req.user?._id;

    console.log("➡️ Incoming session data:", req.body);

    // Validate required fields
    if (!role || !experience || !topicsToFocus || !questions) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: role, experience, topicsToFocus, questions"
      });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Questions must be a non-empty array"
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No valid user found"
      });
    }

    // Create session
    const session = await Session.create({
      user: userId,
      role,
      experience: Number(experience),
      topicsToFocus,
      description: description || "",
    });

    // Create question documents
    const questionDocs = await Question.insertMany(
      questions.map((q) => ({
        session: session._id,
        question: q.question || "",
        answer: q.answer || "",
        isPinned: q.isPinned || false,
        note: q.note || ""
      }))
    );

    // Add question references to session
    session.questions = questionDocs.map((q) => q._id);
    await session.save();

    // Populate and return session
    const populatedSession = await Session.findById(session._id)
      .populate("questions")
      .exec();

    res.status(201).json({
      success: true,
      session: populatedSession,
    });

  } catch (error) {
    console.error("[❌ SESSION CREATION ERROR]:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create session",
      error: error.message || "Unexpected error occurred",
    });
  }
};

// @desc    Get a session by ID
// @route   GET /api/sessions/:id
// @access  Private
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("questions")
      .exec();

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Optional: Check if the session belongs to the logged-in user
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this session" });
    }

    res.status(200).json({ session });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch session", error: error.message });
  }
};

const getMySessions = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No valid user found" });
    }
    const sessions = await Session.find({ user: userId })
      .populate("questions")
      .sort({ updatedAt: -1 })
      .exec();
    res.status(200).json({ success: true, sessions });
  } catch (error) {
    console.error("[❌ GET MY SESSIONS ERROR]:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sessions", error: error.message });
  }
};

const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    // Only allow the owner to delete
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this session" });
    }
    // Delete all questions belonging to this session
    await Question.deleteMany({ session: session._id });
    // Delete the session itself
    await session.deleteOne();
    res.status(200).json({ success: true, message: "Session and its questions deleted" });
  } catch (error) {
    console.error("[❌ DELETE SESSION ERROR]:", error);
    res.status(500).json({ success: false, message: "Failed to delete session", error: error.message });
  }
};

module.exports = {
  createSession,
  getSessionById,
  getMySessions,
  deleteSession,
};
