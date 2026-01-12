// console.log("REQ BODY:", req.body);
// console.log("REQ FILE:", req.file);

const express = require("express");
const router = express.Router();
const PedestrianEntry = require("../models/PedestrianEntry");
console.log("pedestrial router loaded");
// router.post("/", async (req, res) => {
//   try {
//     const entry = new ManualEntry(req.body);
//     await entry.save();
//     res.status(201).json({ message: "Entry saved", entry });
//   } catch (err) {
//     // console.log("REQ BODY:", req.body);
// console.error("Manual Entry Error:", err);
//     res.status(500).json({ message: "Failed to save entry" });
//   }
// });
// CREATE LOG (used by ANPR & Manual)
router.post("/", async (req, res) => {
  try {
    console.log("inside pedestrian router log");
    const log = await PedestrianEntry.create(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// FETCH LOGS (Admin)
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const logs = await PedestrianEntry.find()
    .sort({ scanTime: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json(logs);
});
module.exports = router;
