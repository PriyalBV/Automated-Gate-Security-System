const express = require("express");
const router = express.Router();
const VehicleLog = require("../models/Vehicle_Logs");

console.log("vehicle logs router loaded");

// CREATE LOG (used by ANPR & Manual)
router.post("/", async (req, res) => {
  try {
    const log = await VehicleLog.create(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// FETCH LOGS (Admin)
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const logs = await VehicleLog.find()
    .sort({ scanTime: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json(logs);
});

module.exports = router;
