const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

// ✅ IMPORT ALL CONTROLLERS
const {
  getDashboard,
  getWeeklyReport,
  getWeeklyChart,
  getSubjectWise // 🔥 FIX ADDED
} = require("../controllers/analyticsController");

// ROUTES
router.get("/dashboard", auth, getDashboard);
router.get("/report", auth, getWeeklyReport);
router.get("/weekly-chart", auth, getWeeklyChart);
router.get("/subject-wise", auth, getSubjectWise); // ✅ NOW WORKS

module.exports = router;