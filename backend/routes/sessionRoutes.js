const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  startSession,
  endSession,
  getAllSessions
} = require("../controllers/sessionController");

router.post("/start", auth, startSession);
router.post("/end", auth, endSession);
router.get("/all", auth, getAllSessions);

module.exports = router;