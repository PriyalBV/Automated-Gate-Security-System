// models/Blacklist.js
const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
  vehicleNo: {
    type: String,
    required: true,
    trim: true,
  },
  idProof: {
    type: {
      type: String,
      enum: ['Aadhaar', 'PAN', 'DL'], // possible ID proof types
      required: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    }
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  }
});

// Create Model
const Blacklist = mongoose.model('Blacklist', blacklistSchema);

module.exports = Blacklist;
