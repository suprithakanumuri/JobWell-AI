const express = require("express");
const multer = require("multer");
const { registerUser, loginUser, getUserProfile } = require("../controller/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ imgUrl: imageUrl });
});

module.exports = router;
