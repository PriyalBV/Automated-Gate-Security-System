const Guard = require("../models/Guard");
const bcrypt = require("bcryptjs");

// GET all guards
exports.getAllGuards = async (req, res) => {
  try {
    const guards = await Guard.find().sort({ createdAt: -1 });
    res.status(200).json(guards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ADD a new guard
exports.addGuard = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password, status, guardId } = req.body;
    if (!firstName || !lastName || !phone || !password) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const guard = new Guard({
      firstName,
      lastName,
      phone,
      email: email || null,
      password: hashedPassword,
      status: status || "free",
      guardId,
    });

    await guard.save();
    res.status(201).json({ msg: "Guard added", guard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// UPDATE guard info
exports.updateGuard = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Hash password if it's being updated
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const guard = await Guard.findByIdAndUpdate(id, updateData, { new: true });
    if (!guard) return res.status(404).json({ msg: "Guard not found" });

    res.status(200).json({ msg: "Guard updated", guard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// DELETE a guard
exports.removeGuard = async (req, res) => {
  try {
    const { id } = req.params;
    const guard = await Guard.findByIdAndDelete(id);
    if (!guard) return res.status(404).json({ msg: "Guard not found" });

    res.status(200).json({ msg: "Guard removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
