const Parent = require('../models/Parent');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Parent
exports.registerParent = async (req, res) => {
  try {
    let { firstName, lastName, email, phone, password } = req.body;

    // Trim and normalize inputs
    firstName = firstName?.trim();
    lastName = lastName?.trim();
    email = email?.trim().toLowerCase();
    phone = phone?.trim();
    password = password?.trim();

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ msg: 'Please fill all required fields' });
    }

    const existing = await Parent.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);

    const newParent = new Parent({ firstName, lastName, email, phone, password: hashed });
    await newParent.save();

    const { password: pw, ...parentSafe } = newParent.toObject();
    res.status(201).json({ msg: 'Parent registered', parent: parentSafe });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login Parent
exports.loginParent = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    const parent = await Parent.findOne({ email });
    if (!parent) return res.status(400).json({ msg: "Parent not found" });

    const isMatch = await bcrypt.compare(password, parent.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

    const token = jwt.sign(
  {
    parentId: parent._id,
    parentEmail: parent.email   // 🔥 ADD THIS
  },
  "AGSS_BV_SECRET_KEY",
  { expiresIn: "1d" }
);


    res.json({
      msg: "Login successful",
      token,
      parent: {
        id: parent._id,
        firstName: parent.firstName,
        lastName: parent.lastName,
        email: parent.email
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};