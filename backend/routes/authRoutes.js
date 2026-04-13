const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  register,
  login,
  setDailyGoal
} = require("../controllers/authController");

// AUTH
router.post("/register", register);
router.post("/login", login);

// 🔥 NEW ROUTE
router.post("/goal", auth, setDailyGoal);

module.exports = router;