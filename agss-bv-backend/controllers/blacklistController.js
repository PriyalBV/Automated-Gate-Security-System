const Whitelist = require("../models/whitelist");
const Blacklist = require("../models/Blacklist");

// GET all blacklisted vehicles
const getBlacklist = async (req, res) => {
  try {
    const data = await Blacklist.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD to blacklist (ADMIN OVERRIDES WHITELIST 🔥)
const addToBlacklist = async (req, res) => {
  try {
    const vehicleNo = req.body.vehicleNo.toUpperCase().trim();

    // remove from whitelist if exists
    await Whitelist.deleteOne({ vehicleNo });

    const blacklisted = await Blacklist.create({
      ...req.body,
      vehicleNo,
    });

    res.status(201).json({
      success: true,
      message: "Vehicle blacklisted. Whitelist entry (if any) removed.",
      blacklisted,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REMOVE from blacklist
const removeFromBlacklist = async (req, res) => {
  try {
    const removed = await Blacklist.findByIdAndDelete(req.params.id);

    if (!removed) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json({ success: true, message: "Removed from blacklist" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getBlacklist,
  addToBlacklist,
  removeFromBlacklist,
};
