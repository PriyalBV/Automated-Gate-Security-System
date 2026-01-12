const mongoose = require("mongoose");
// not being used wrong model --> 11th jan found that 
const vehicleLogSchema = new mongoose.Schema(
  {
    vehicleNo: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true
    },

    vehicleType: {
      type: String,
      enum: ["two", "four"],
      required: true
    },

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
  {
    timestamps: true // createdAt / updatedAt
  }
);

// Optimized indexes for logs page
vehicleLogSchema.index({ vehicleNo: 1, scanTime: -1 });
vehicleLogSchema.index({ movementType: 1 });
vehicleLogSchema.index({ "source.type": 1 });

module.exports = mongoose.model("VehicleLog", vehicleLogSchema);
