const express = require("express");
const authenticateAdmin = require("../middleware/authMiddleware");

const {
  createVehicleAssignment,
  getAssignments,
  getAssignment,
  removeAssignment,
} = require("../controllers/assignmentController");

const router = express.Router();

router.use(authenticateAdmin);

router.post("/", createVehicleAssignment);
router.get("/", getAssignments);
router.get("/:id", getAssignment);
router.delete("/:id", removeAssignment);

module.exports = router;