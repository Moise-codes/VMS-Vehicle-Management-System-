const {
  createVehicle,
  getVehiclesByAdmin,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require("../models/vehicleModel");

const registerVehicle = async (req, res) => {
  try {
    const {
      chassisNumber,
      manufacturer,
      manufactureYear,
      price,
      modelName,
    } = req.body;

    const adminId = req.admin.id;

    if (
      !chassisNumber ||
      !manufacturer ||
      !manufactureYear ||
      !price ||
      !modelName
    ) {
      return res.status(400).json({
        success: false,
        message: "All vehicle fields are required",
      });
    }

    const vehicle = await createVehicle({
      adminId,
      chassisNumber,
      manufacturer,
      manufactureYear,
      price,
      modelName,
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle registered successfully",
      vehicle,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "A vehicle with this chassis number already exists",
      });
    }

    console.error("Register vehicle error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to register vehicle",
    });
  }
};

const getVehicles = async (req, res) => {
  try {
    const adminId = req.admin.id;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 10, 1),
      100
    );

    const result = await getVehiclesByAdmin(
      adminId,
      page,
      limit
    );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Get vehicles error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve vehicles",
    });
  }
};

const getVehicle = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { id } = req.params;

    const vehicle = await getVehicleById(id, adminId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      vehicle,
    });
  } catch (error) {
    console.error("Get vehicle error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve vehicle",
    });
  }
};

const editVehicle = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { id } = req.params;

    const {
      chassisNumber,
      manufacturer,
      manufactureYear,
      price,
      modelName,
    } = req.body;

    if (
      !chassisNumber ||
      !manufacturer ||
      !manufactureYear ||
      !price ||
      !modelName
    ) {
      return res.status(400).json({
        success: false,
        message: "All vehicle fields are required",
      });
    }

    const vehicle = await updateVehicle({
      id,
      adminId,
      chassisNumber,
      manufacturer,
      manufactureYear,
      price,
      modelName,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "A vehicle with this chassis number already exists",
      });
    }

    console.error("Update vehicle error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update vehicle",
    });
  }
};

const removeVehicle = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { id } = req.params;

    const vehicle = await deleteVehicle(id, adminId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("Delete vehicle error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
    });
  }
};

module.exports = {
  registerVehicle,
  getVehicles,
  getVehicle,
  editVehicle,
  removeVehicle,
};