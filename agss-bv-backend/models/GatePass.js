//models/gatePass.js
// models/gatePass.js
const mongoose = require("mongoose");

const gatePassSchema = new mongoose.Schema({
  

  studentId: {
    type: String,
    required: true,
    trim: true
  },

  studentName: {
    type: String,
    required: true,
    trim: true
  },

  expectedExitDate: {
    type: String,          // e.g., "2025-11-06"
    required: true
  },

  expectedExitTime: {
    type: String,          // e.g., "15:30"
    required: true
  },

  notificationStatus: {
    type: String,
    enum: ["sent", "not sent"],
    default: "not sent"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

// Optional: fast lookups
gatePassSchema.index({ studentId: 1, expectedExitDate: -1 });


module.exports = mongoose.models.GatePass || mongoose.model("GatePass", gatePassSchema);