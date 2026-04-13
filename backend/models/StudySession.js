const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  subject: String,
  startTime: Date,
  endTime: Date,
  duration: Number, // in minutes
  breakCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("StudySession", studySessionSchema);