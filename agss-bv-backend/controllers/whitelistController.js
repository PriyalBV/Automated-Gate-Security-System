const Whitelist = require('../models/whitelist');
const Blacklist = require('../models/Blacklist');

exports.addToWhitelist = async (req, res) => {
  try {
    const vehicleNo = req.body.vehicleNo.toUpperCase().trim();

    // 🚫 ADMIN LOGIC: block if blacklisted
    const blacklisted = await Blacklist.findOne({ vehicleNo });
    if (blacklisted) {
      return res.status(403).json({
        success: false,
        message: 'Vehicle is blacklisted. Remove from blacklist first.'
      });
    }

    const whitelisted = await Whitelist.create({
      ...req.body,
      vehicleNo
    });

    res.status(201).json({
      success: true,
      whitelisted
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWhitelist = async (req, res) => {
  try {
    const whitelist = await Whitelist.find().sort({ createdAt: -1 });
    res.status(200).json(whitelist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromWhitelist = async (req, res) => {
  try {
    const removed = await Whitelist.findByIdAndDelete(req.params.id);

    if (!removed) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json({ success: true, message: "Removed from whitelist" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
