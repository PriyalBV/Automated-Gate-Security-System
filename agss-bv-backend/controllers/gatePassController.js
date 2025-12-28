//controller/gatePassController.js
const GatePass = require("../models/gatePass");

// CREATE gate pass
exports.createGatePass = async (req, res) => {
  try {
    const {
      student,
      studentId,
      studentName,
      expectedExitDate,
      expectedExitTime
    } = req.body;

    // basic validation
    if (!student || !studentId || !studentName || !expectedExitDate || !expectedExitTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const gatePass = new GatePass({
      student,
      studentId,
      studentName,
      expectedExitDate,
      expectedExitTime
    });

    await gatePass.save();

    res.status(201).json({
      message: "Gate pass created successfully",
      gatePass
    });

  } catch (error) {
    console.error("Gate pass error:", error);
    res.status(500).json({ message: "Server error" });
  }
};