const express = require("express");

const {
  registerAdmin,
  loginAdmin,
  getCurrentAdmin,
  logoutAdmin,
} = require("../controllers/authController");

const authenticateAdmin = require("../middleware/authMiddleware");

const {
  validateAdminRegistration,
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/register",
  validateAdminRegistration,
  registerAdmin
);

router.post("/login", loginAdmin);

router.get(
  "/me",
  authenticateAdmin,
  getCurrentAdmin
);

router.post(
  "/logout",
  authenticateAdmin,
  logoutAdmin
);

module.exports = router;