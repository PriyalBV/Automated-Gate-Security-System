// models/whitelist.js
const mongoose = require("mongoose");

const whitelistSchema = new mongoose.Schema({
  vehicleOwnerName: {
    type: String,
    required: true,
    trim: true
  },

  vehicleNo: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,    // Standardize vehicle numbers like "RJ14AB1234"
    trim: true
  },

  type: {
    type: String,
    enum: ["staff", "faculty", "staff family", "worker", "shop owner"],
    required: true
  },

  approvedBy: {
    type: String,       // Optional: admin who added the entry
    default: "system"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

// 🔍 For quick searches and analytics
whitelistSchema.index({ vehicleNo: 1, type: 1 });

module.exports = mongoose.model("Whitelist", whitelistSchema);
