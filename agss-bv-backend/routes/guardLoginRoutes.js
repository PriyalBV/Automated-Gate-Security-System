const GuardLogin = require("../models/guard_Login");
const express = require("express");
const router = express.Router();
const { loginGuard } = require("../controllers/guardLoginControllers");

router.post("/login", GuardLogin);

module.exports = router;
