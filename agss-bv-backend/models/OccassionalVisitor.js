// models/OccasionalVisitor.js
const mongoose = require('mongoose');

const occasionalVisitorSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',   // references the Request table
    required: true
  },
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
  dateOfVisit: {
    type: Date,
    required: true
  }
}, { timestamps: true }); // adds createdAt and updatedAt automatically

// Create Model
const OccasionalVisitor = mongoose.model('OccasionalVisitor', occasionalVisitorSchema);

module.exports = OccasionalVisitor;
