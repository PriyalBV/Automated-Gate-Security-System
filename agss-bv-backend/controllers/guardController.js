const Guard = require("../models/Guard");
const bcrypt = require("bcryptjs");

// ---------------------------
// REGISTER GUARD
// ---------------------------
exports.registerGuard = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;

    if (!firstName || !lastName || !phone || !password) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    if (email) {
      const existing = await Guard.findOne({ email });
      if (existing) return res.status(400).json({ msg: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const guard = new Guard({
      firstName,
      lastName,
      phone,
      email: email || null,
      password: hashedPassword,
    });

    await guard.save();

    res.status(201).json({
      msg: "Guard registered successfully",
      guard,
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
