const mongoose = require("mongoose");

const manualEntrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNo: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },
    idProof: {
      type: String,
      enum: ["Aadhaar", "PAN", "DL"],
      required: true,
    },
    idProofNumber: {
      type: String,
      required: true,
      trim: true,
    },
    reasonOfVisit: {
      type: String,
      required: true,
    },
    otherReason: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ManualEntry", manualEntrySchema);
