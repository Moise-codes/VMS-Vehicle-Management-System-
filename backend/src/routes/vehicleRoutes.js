const express = require("express");
const authenticateAdmin = require("../middleware/authMiddleware");
const {
  registerVehicle,
  getVehicles,
  getVehicle,
  editVehicle,
  removeVehicle,
} = require("../controllers/vehicleController");

const router = express.Router();

router.use(authenticateAdmin);

router.post("/", registerVehicle);
router.get("/", getVehicles);
router.get("/:id", getVehicle);
router.put("/:id", editVehicle);
router.delete("/:id", removeVehicle);

module.exports = router;