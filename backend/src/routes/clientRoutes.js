const express = require("express");
const authenticateAdmin = require("../middleware/authMiddleware");
const {
  registerClient,
  getClients,
  getClient,
  editClient,
  removeClient,
} = require("../controllers/clientController");

const router = express.Router();

router.use(authenticateAdmin);

router.post("/", registerClient);
router.get("/", getClients);
router.get("/:id", getClient);
router.put("/:id", editClient);
router.delete("/:id", removeClient);

module.exports = router;