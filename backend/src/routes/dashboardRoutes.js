const express = require("express");
const authenticateAdmin = require("../middleware/authMiddleware");
const { getDashboard } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/", authenticateAdmin, getDashboard);

module.exports = router;