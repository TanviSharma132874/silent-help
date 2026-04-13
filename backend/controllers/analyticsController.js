const StudySession = require("../models/StudySession");
const User = require("../models/User");
const { calculateAnalytics } = require("../services/analyticsService");

// DASHBOARD
exports.getDashboard = async (req, res) => {
  try {
    const sessions = await StudySession.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    const analytics = calculateAnalytics(sessions);

    const user = await User.findById(req.user.id);

    res.json({
      sessions,
      analytics,
      dailyGoal: user?.dailyGoal || 300
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REPORT
exports.getWeeklyReport = async (req, res) => {
  try {
    const sessions = await StudySession.find({
      userId: req.user.id
    });

    const analytics = calculateAnalytics(sessions);

    res.json({ analytics });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// WEEKLY CHART
exports.getWeeklyChart = async (req, res) => {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6);

    const sessions = await StudySession.find({
      userId: req.user.id,
      createdAt: { $gte: last7Days }
    });

    const dataMap = {};

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      dataMap[key] = 0;
    }

    sessions.forEach(s => {
      const key = new Date(s.createdAt).toISOString().split("T")[0];
      if (dataMap[key] !== undefined) {
        dataMap[key] += s.duration || 0;
      }
    });

    const labels = Object.keys(dataMap).sort();
    const data = labels.map(date => dataMap[date]);

    res.json({ labels, data });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 NEW: SUBJECT-WISE ANALYTICS
exports.getSubjectWise = async (req, res) => {
  try {
    const sessions = await StudySession.find({
      userId: req.user.id
    });

    const subjectMap = {};

    sessions.forEach(s => {
      const subject = s.subject || "Other";

      if (!subjectMap[subject]) {
        subjectMap[subject] = 0;
      }

      subjectMap[subject] += s.duration || 0;
    });

    const labels = Object.keys(subjectMap);
    const data = Object.values(subjectMap);

    res.json({
      labels,
      data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};