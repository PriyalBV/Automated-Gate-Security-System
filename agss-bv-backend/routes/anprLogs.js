// routes/anprLogs.js
const express = require("express");
const router = express.Router();
const VehicleLog = require("../models/Vehicle_Logs");

router.post("/anpr-log", async (req, res) => {
  try {
    const {
      plate,
      vehicle_type,
      category,
      decision,
      confidence
    } = req.body;

    const movementType = "ENTRY"; // later make smart

    const log = await VehicleLog.create({
      vehicleNo: plate,
      vehicleType: vehicle_type,
      category,
      decision,
      confidence,
      movementType,
      source: {
        type: "ANPR",
        cameraId: "CAMERA_1"
      }
    });

    res.json({ success: true, log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
