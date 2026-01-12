const mongoose = require("mongoose");

const manualEntrySchema = new mongoose.Schema(
  {
    /* ------------------ Person Details ------------------ */
    category: {
      type: String,
      enum: ["whitelist", "blacklist", "occasional", "manual"],
      required: true
    },

    movementType: {
      type: String,
      enum: ["ENTRY", "EXIT"],
      required: true,
    },

    decision: {
      type: String,
      enum: ["ALLOWED", "DENIED", "NOT_DETECTED"],
      required: true
    },

    confidence: {
      type: Number,
      min: 0,
      max: 1
    },

    source: {
      type: {
        type: String,
        enum: ["ANPR", "MANUAL"],
        required: true
      },

      cameraId: {
        type: String,
        default: null
      },

      guardId: {
        type: String,
        ref: "User",
        default: null
      }
    },

    scanTime: {
      type: Date,
      default: Date.now,
      index: true
    },

    driverDetails:{
      driverName: {
        type: String,
        required: false,
        trim: true
      },

      phoneNumber: {
        type: Number,
        required: false,
        trim: true
      },

      proofType: {
        type: String,
        required: false,
        trim: true
      },

      proofId: {
        type: String,
        required: false,
        trim: true
      },
    },
    reason: {
      type: String,
      required: false,
      trim: true
    },
  },
  { timestamps: true }
);

// Indexes
manualEntrySchema.index({ vehicleNo: 1 });
manualEntrySchema.index({ entryAt: -1 });
manualEntrySchema.index({ guardId: 1 });

module.exports = mongoose.model("PedestrianEntry", manualEntrySchema);
