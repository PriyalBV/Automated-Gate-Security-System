//adminSettingRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminSettingController = require("../controllers/adminSettingController");
const authAdmin = require("../middleware/authAdmin");

// Login
router.post("/admins/login", adminController.loginAdmin);

// Get profile
router.get("/settings/admin", authAdmin, adminSettingController.getAdminProfile);

// Verify password
router.post(
  "/settings/admin/verify-password",
  authAdmin,
  adminSettingController.verifyAdminPassword
);

// Update profile
router.put(
  "/settings/admin",
  authAdmin,
  adminSettingController.updateAdminProfile
);

module.exports = router;