// models/student.js
const mongoose = require("mongoose");

// Reusable sub-schema for address
const addressSchema = new mongoose.Schema({
  houseNo: { type: String, required: true },
  street: { type: String, required: true },
  pincode: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true }
});

// Main Student Schema
const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  firstName: {
    type: String,
    required: true,
    trim: true
  },

  lastName: {
    type: String,
    required: true,
    trim: true
  },

  personalEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  collegeEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  irisData: {
    type: mongoose.Schema.Types.Mixed,  
    // Real use case:
    // Option 1: base64 encoded cropped iris image
    // Option 2: iris feature vector (Float32Array converted to JSON)
    // Option 3: path/URL to stored image in cloud storage
    required: true
  },

  parentsEmail: {
    type: [String],
    required: true,
    validate: {
      validator: (emails) => emails.length > 0,
      message: "At least one parent email is required."
    }
  },

  rollNo: {
    type: String,
    required: true,
    unique: true
  },

  course: {
    type: String,
    required: true
  },

  address: {
    type: addressSchema,
    required: true
  },

  // 👇 Reference link to parent model (for direct population)
  parentRefs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent"
  }],

  // 👇 For gate log mapping
  currentStatus: {
    type: String,
    enum: ["inside", "outside"],
    default: "inside"
  }

}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
