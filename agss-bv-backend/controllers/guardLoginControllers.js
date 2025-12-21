const Guard = require("../models/Guard");
const GuardLogin = require("../models/guard_Login");
const bcrypt = require("bcryptjs");

// ------------------------------------
// LOGIN GUARD
// ------------------------------------
exports.loginGuard = async (req, res) => {
  try {
    const { guardId, password } = req.body;

    if (!guardId || !password) {
      return res.status(400).json({ msg: "Guard ID and password required" });
    }

    const guard = await Guard.findOne({ guardId });

    if (!guard) {
      return res.status(404).json({ msg: "Guard not found" });
    }

    const isMatch = await bcrypt.compare(password, guard.password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const loginData = await GuardLogin.create({
      guard: guard._id,
      guardId,
      loginTime: new Date().toLocaleTimeString("en-US", { hour12: false }),
      loginDate: new Date().toISOString().split("T")[0],
      status: "logged-in"
    });

    res.json({
      msg: "Guard logged in successfully",
      login: loginData
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
