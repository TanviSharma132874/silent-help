const StudySession = require("../models/StudySession");

// START SESSION
exports.startSession = async (req, res) => {
  try {
    const { subject } = req.body;

    if (!subject) {
      return res.status(400).json({ msg: "Subject is required" });
    }

    const session = new StudySession({
      userId: req.user.id,
      subject,
      startTime: new Date()
    });

    await session.save();

    res.json({
      msg: "Session started",
      session
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// END SESSION
exports.endSession = async (req, res) => {
  try {
    const { sessionId, breakCount } = req.body;

    const session = await StudySession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ msg: "Session not found" });
    }

    // 🔒 Security: ensure same user
    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // ❌ Prevent double ending
    if (session.endTime) {
      return res.status(400).json({ msg: "Session already ended" });
    }

    const endTime = new Date();

    let duration = (endTime - session.startTime) / (1000 * 60); // minutes

    // ✅ Fix: minimum 1 minute
    duration = Math.max(1, Math.round(duration));

    session.endTime = endTime;
    session.duration = duration;
    session.breakCount = breakCount || 0;

    await session.save();

    res.json({
      msg: "Session ended",
      session
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL SESSIONS
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await StudySession.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(sessions);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};