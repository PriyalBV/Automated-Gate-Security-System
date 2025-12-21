const mongoose = require("mongoose");

const studentLogSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
  status: { type: String, default: "inside" },
});

// ✅ CommonJS export (matches your server.js)
module.exports = mongoose.model("StudentLog", studentLogSchema);
