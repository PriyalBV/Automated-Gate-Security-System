// console.log("REQ BODY:", req.body);
// console.log("REQ FILE:", req.file);

const express = require("express");
const router = express.Router();
const ManualEntry = require("../models/ManualEntry");

router.post("/", async (req, res) => {
  try {
    const entry = new ManualEntry(req.body);
    await entry.save();
    res.status(201).json({ message: "Entry saved", entry });
  } catch (err) {
    // console.log("REQ BODY:", req.body);
console.error("Manual Entry Error:", err);
    res.status(500).json({ message: "Failed to save entry" });
  }
});

module.exports = router;
