const {
  createAssignment,
  getAssignmentsByAdmin,
  getAssignmentById,
  deleteAssignment,
} = require("../models/assignmentModel");

const createVehicleAssignment = async (req, res) => {
  try {
    const { vehicleId, clientId, plateNumber } = req.body;
    const adminId = req.admin.id;

    if (!vehicleId || !clientId || !plateNumber) {
      return res.status(400).json({
        success: false,
        message: "Vehicle, client and plate number are required",
      });
    }

    const vehicle = await require("../config/database").query(
      "SELECT id FROM vehicles WHERE id = $1 AND admin_id = $2",
      [vehicleId, adminId]
    );

    if (vehicle.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    const client = await require("../config/database").query(
      "SELECT id FROM clients WHERE id = $1 AND admin_id = $2",
      [clientId, adminId]
    );

    if (client.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const assignment = await createAssignment({
      vehicleId,
      clientId,
      adminId,
      plateNumber,
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle assigned successfully",
      assignment,
    });
  } catch (error) {
    if (error.code === "23505") {
      if (error.constraint === "unique_vehicle_assignment") {
        return res.status(409).json({
          success: false,
          message: "This vehicle is already assigned",
        });
      }

      return res.status(409).json({
        success: false,
        message: "This plate number is already in use",
      });
    }

    console.error("Create assignment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to assign vehicle",
    });
  }
};

const getAssignments = async (req, res) => {
  try {
    const adminId = req.admin.id;

    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 10, 1),
      100
    );

    const result = await getAssignmentsByAdmin(
      adminId,
      page,
      limit
    );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Get assignments error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve assignments",
    });
  }
};

const getAssignment = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { id } = req.params;

    const assignment = await getAssignmentById(id, adminId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    return res.status(200).json({
      success: true,
      assignment,
    });
  } catch (error) {
    console.error("Get assignment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve assignment",
    });
  }
};

const removeAssignment = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { id } = req.params;

    const assignment = await deleteAssignment(id, adminId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle assignment removed successfully",
    });
  } catch (error) {
    console.error("Delete assignment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to remove assignment",
    });
  }
};

module.exports = {
  createVehicleAssignment,
  getAssignments,
  getAssignment,
  removeAssignment,
};