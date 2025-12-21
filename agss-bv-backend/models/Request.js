// models/request.js
const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  visitorName: {
    type: String,
    required: true,
    trim: true
  },

  dateOfVisit: {
    type: String,         // e.g., "2025-11-06"
    required: true
  },

  reason: {
    type: String,
    required: true,
    trim: true
  },

  type: {
    type: String,
    enum: ["parent", "non-parent"],
    required: true
  },

  status: {
    type: String,
    enum: ["approved", "rejected", "pending"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

// Index for faster admin dashboard queries
requestSchema.index({ dateOfVisit: -1, status: 1 });

module.exports = mongoose.model("Request", requestSchema);
