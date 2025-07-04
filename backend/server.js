const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

// Routes
const sessionRoutes = require("./routes/sessionRoutes");
const authRoutes = require("./routes/authRoutes");
const { generateInterviewQuestions, generateConceptExplanation } = require("./controller/aiController");
const questionRoutes = require("./routes/questionRoutes");
const aiRoutes = require("./routes/aiRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health-check", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes); // ✅ AUTH ROUTES FIXED
app.use("/api/sessions", sessionRoutes); // ✅ SESSION ROUTES FIXED
app.post("/api/ai/generate-questions", generateInterviewQuestions);
app.post("/api/ai/explain-concept", generateConceptExplanation);
app.use("/api/questions", questionRoutes);
app.use("/api/ai", aiRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
