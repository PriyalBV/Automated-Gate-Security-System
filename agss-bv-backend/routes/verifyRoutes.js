//routes/verifyRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const Student = require("../models/Student");
const GatePass = require("../models/gatePass");

// Local date-time safe check
function isGatePassValid(gatePass) {
  const now = new Date();

  const [y, m, d] = gatePass.expectedExitDate.split("-");
  const [hh, mm] = gatePass.expectedExitTime.split(":");

  const exitTime = new Date(
    Number(y),
    Number(m) - 1,
    Number(d),
    Number(hh),
    Number(mm),
    0
  );

  return exitTime >= now;
}

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { student_id } = req.body;

    if (!student_id || !req.file) {
      return res.status(400).json({ match: false, error: "Missing data" });
    }

    // 1️⃣ Student exists?
    const student = await Student.findOne({ studentId: student_id });
    if (!student) {
      return res.json({ match: false, error: "Student not found" });
    }

    // 2️⃣ Iris match (dummy true for now)
    const irisMatch = true;
    if (!irisMatch) {
      return res.json({ match: false, error: "Iris mismatch" });
    }

    // 3️⃣ GatePass exists?
    const gatePass = await GatePass.findOne({
      studentId: student_id,
      status: "APPROVED"
    }).sort({ createdAt: -1 });

    if (!gatePass) {
      return res.json({ match: false, error: "GatePass not found" });
    }

    // 4️⃣ GatePass valid time?
    if (!isGatePassValid(gatePass)) {
      return res.json({ match: false, error: "GatePass expired" });
    }

    // ✅ ALL PASSED
    return res.json({ match: true, message: "Access Granted" });

  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return res.status(500).json({ match: false, error: "Server error" });
  }
});

module.exports = router;