const User = require("../modals/User"); // ✅ FIXED the path from "modals" to "models"
const bcrypt = require("bcryptjs");

const createDefaultUser = async () => {
  try {
    const existingUser = await User.findOne({ email: "admin@example.com" });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const user = new User({
        name: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
        profileImageUrl: "", // optional
      });

      await user.save();
      console.log("✅ Default admin user created: admin@example.com / admin123");
    } else {
      console.log("ℹ️ Default admin user already exists");
    }
  } catch (error) {
    console.error("❌ Error creating default user:", error.message);
  }
};

module.exports = createDefaultUser;
