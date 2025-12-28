// models/OccasionalVisitor.js
const mongoose = require('mongoose');

const occasionalVisitorSchema = new mongoose.Schema({
  visitorName: {
    type: String,
    required: true,
    trim: true
  },
  noOfCompanions: {
    type: Number,
    required: true,
    min: 0
  },
  vehicleNo: {
    type: String,
    trim: true
  },
  visitorType: {
    type: String,
    enum: ['Parent', 'Non-Parent'],
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
  type: String,
  required: true,
  match: [/^\+?[1-9]\d{9,14}$/, "Invalid phone number"]
}
,
  dateOfVisit: {
    type: Date,
    required: true
  }
}, { timestamps: true }); // adds createdAt and updatedAt automatically

// Create Model
const OccasionalVisitor = mongoose.model('OccasionalVisitor', occasionalVisitorSchema);

module.exports = OccasionalVisitor;