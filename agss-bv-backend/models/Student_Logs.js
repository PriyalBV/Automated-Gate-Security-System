// models/studentLog.js
const mongoose = require("mongoose");

const studentLogSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  studentId: {
    type: String,
    required: true
  },

  studentName: {
    type: String,
    required: true
  },

  exitTime: {
    type: String,
    required: false
  },

  exitDate: {
    type: String,
    required: false
  },

  entryTime: {
    type: String,
    required: false
  },

  entryDate: {
    type: String,
    required: false
  },

  status: {
    type: String,
    enum: ["exited", "entered", "inside", "outside"],
    default: "inside"
  },

  // 🔥 This field will control auto-expiry (1 year)
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 365 // 1 year in seconds
  }

});

// For faster queries
studentLogSchema.index({ studentId: 1, exitDate: -1 });

module.exports = mongoose.model("StudentLog", studentLogSchema);
