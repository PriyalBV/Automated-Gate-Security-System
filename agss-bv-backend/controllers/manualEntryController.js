const ManualEntry = require("../models/ManualEntry");

exports.createManualEntry = async (req, res) => {
  try {
    const entry = new ManualEntry(req.body);
    await entry.save();

    return res.status(201).json({
      success: true,
      message: "Manual entry saved successfully",
      data: entry,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error saving entry",
      error: error.message,
    });
  }
};
