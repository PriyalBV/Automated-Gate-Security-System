const express = require("express");
const router = express.Router();
const GatePass = require("../models/gatePass");
const Student = require("../models/Student");

// ✅ CREATE GATE PASS
router.post("/create", async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      expectedExitDate,
      expectedExitTime
    } = req.body;

    // Validation
    if (!studentId || !studentName || !expectedExitDate || !expectedExitTime) {
      return res.status(400).json({ message: "All fields required" });
    }

    const gatePass = new GatePass({
      studentId,
      studentName,
      expectedExitDate,
      expectedExitTime,
      notificationStatus: "not sent"
    });

    await gatePass.save();

    res.status(201).json({
      message: "✅ GatePass created successfully",
      gatePass
    });

  } catch (err) {
    console.error("❌ GatePass Create Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/verify", async (req, res) => {
  try {
    const { studentId } = req.query;
    if (!studentId) return res.json({ valid: false });

    // Get latest gate pass
    const gatePass = await GatePass.findOne({ studentId }).sort({ createdAt: -1 });
    if (!gatePass) return res.json({ valid: false });

    const now = new Date();

    // ✅ LOCAL DATE (IST SAFE)
    const today =
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0");

    // ❌ Date mismatch → deny
    if (gatePass.expectedExitDate !== today) {
      return res.json({ valid: false });
    }

    // Parse expected exit time
    const [hours, minutes] = gatePass.expectedExitTime.split(":").map(Number);
    const exitTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0
    );

    // ❌ Current time < exit time → deny
    if (now < exitTime) {
      return res.json({ valid: false });
    }

    // ✅ Date same AND current time >= exit time → GRANT
    // 🔹 Insert into Student_Logs
    const studentRecord = await Student.findOne({ studentId });
    if (studentRecord) {
      // Check if log already exists for today to avoid duplicates
      const existingLog = await Student_Logs.findOne({
        studentId,
        exitDate: today
      });

      if (!existingLog) {
        const log = new Student_Logs({
          student: studentRecord._id,
          studentId,
          studentName: gatePass.studentName,
          exitDate: today,
          exitTime: gatePass.expectedExitTime,
          status: "exited"
        });
        await log.save();
        console.log("✅ Exit log stored in Student_Logs");
      }
    }

    return res.json({
      valid: true,
      expectedExitDate: gatePass.expectedExitDate,
      expectedExitTime: gatePass.expectedExitTime
    });

  } catch (err) {
    console.error("❌ GatePass Verify Error:", err);
    return res.status(500).json({ valid: false });
  }
});


module.exports = router;