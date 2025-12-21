// models/vehicleLog.js
const mongoose = require("mongoose");

const vehicleLogSchema = new mongoose.Schema({
  vehicleNo: {
    type: String,
    required: true,
    trim: true,
    uppercase: true   // Ensures "RJ14AB1234" and "rj14ab1234" are treated same
  },

  entryTime: {
    type: String,      // e.g., "09:45"
    required: false
  },

  entryDate: {
    type: String,      // e.g., "2025-11-06"
    required: false
  },

  exitTime: {
    type: String,      // e.g., "17:30"
    required: false
  },

  exitDate: {
    type: String,      // e.g., "2025-11-06"
    required: false
  },

  status: {
    type: String,
    enum: ["inside", "exited"],
    default: "inside"
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 365  // auto-delete after 1 year
  }

}, { timestamps: true });

// Index for quick search by vehicle number
vehicleLogSchema.index({ vehicleNo: 1, entryDate: -1 });

module.exports = mongoose.model("VehicleLog", vehicleLogSchema);
