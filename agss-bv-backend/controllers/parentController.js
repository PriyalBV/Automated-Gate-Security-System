/* ---------------------- 🔐 PARENT REGISTRATION ---------------------- */
const Parent = require('../models/Parent');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

exports.registerParent = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ msg: 'Please fill all required fields' });
    }

    let existing = await Parent.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const newParent = new Parent({ firstName, lastName, email, phone, password: hashed });
    await newParent.save();

    res.status(201).json({ msg: 'Parent registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};



/* ---------------------- 🔐 PARENT LOGIN ---------------------- */
exports.loginParent = async (req, res) => {
    try {
        const { email, password } = req.body;

        const parent = await Parent.findOne({ email });
        if (!parent) {
            return res.status(400).json({ msg: "Parent not found" });
        }

        const isMatch = await bcrypt.compare(password, parent.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect password" });
        }

        const token = jwt.sign(
            { parentId: parent._id },
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