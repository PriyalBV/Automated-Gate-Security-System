const express = require('express');
const cors = require('cors');
const connectDB = require('./connectDB');
const StudentLog = require('./models/StudentLog');

const app = express();

require("dotenv").config();

// Middlewares
app.use(express.json());
// app.use(cors());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Connect Database
connectDB();

// Test Route
app.get('/', (req, res) => {
  res.send('✅ AGSS-BV Backend with Mongoose is running!');
});

// Student Entry API
app.post('/student-entry', async (req, res) => {
  try {
    console.log("📥 Incoming data:", req.body);

    const { studentId, entryType, name, department, year } = req.body;

    const newLog = new StudentLog({
      studentId,
      entryType,
      name,
      department,
      year,
      timestamp: new Date()
    });

    await newLog.save();
    res.status(200).json({ message: "Logged successfully ✅" });
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// ADMIN ROUTES
const adminRoutes = require("./routes/adminRoutes");
app.use('/api', adminRoutes);

// PARENT ROUTES
const parentRoutes = require("./routes/parent");
app.use("/api/parents", parentRoutes);

// GUARD ROUTES (REGISTER + LOGIN) — FIXED
const guardRoutes = require("./routes/guard");
const guardLoginRoutes = require("./routes/guardLoginRoutes");

// BOTH under SAME BASE PATH (IMPORTANT)
app.use("/api/guard", guardRoutes);       // /api/guard/register
app.use("/api/guard", guardLoginRoutes);  // /api/guard/login


const manualEntryRoutes = require("./routes/manualEntryRoutes");
app.use("/api/manual-entry", manualEntryRoutes);

// VERIFY ROUTES
const verifyRoutes = require("./routes/verifyRoutes");
app.use("/api/verify", verifyRoutes);

//verify gatepass
const gatePassRoutes = require("./routes/gatePassRoutes");
app.use("/api/gatepass", gatePassRoutes);

// REQUEST ROUTES
const requestRoutes = require("./routes/requestRoutes");
app.use("/api/requests", requestRoutes);

// OCCASIONAL VISITOR ROUTES
const occasionalVisitorRoutes = require("./routes/occasionalVisitorRoutes");
app.use("/api/occasional-visitors", occasionalVisitorRoutes);

// WHITELIST ROUTES
const whitelistRoutes = require('./routes/whitelistRoutes');
app.use('/api/whitelist', whitelistRoutes);

// BLACKLIST ROUTES
const blacklistRoutes = require('./routes/blacklistRoutes');
app.use('/api/blacklist', blacklistRoutes);

// GUARD MANAGEMENT ROUTES
const guardAdminRoutes = require("./routes/guardRoutes");
app.use("/api/guard", guardAdminRoutes);

// ACCESS CHECK (GATE) ROUTES
const accessRoutes = require('./routes/accessRoutes');
app.use('/api/access', accessRoutes);

// STUDENT ROUTES
const studentRoutes = require("./routes/students");
app.use("/api/students", studentRoutes);

// PARENT VISIT ROUTES
const parentVisitRoutes = require("./routes/parentVisit");
app.use("/api/parent", parentVisitRoutes);

// LISTEN
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));