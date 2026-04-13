const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true
  },

  password: String,

  // 🔥 NEW FIELD
  dailyGoal: {
    type: Number,
    default: 300 // default 300 mins (5 hours)
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);