const {
  createClient,
  getClientsByAdmin,
  getClientById,
  updateClient,
  deleteClient,
} = require("../models/clientModel");

const registerClient = async (req, res) => {
  try {
    const { names, nationalId, telephone, address } = req.body;
    const adminId = req.admin.id;

    if (!names || !nationalId || !telephone || !address) {
      return res.status(400).json({
        success: false,
        message: "All client fields are required",
      });
    }

    const client = await createClient({
      adminId,
      names,
      nationalId,
      telephone,
      address,
    });

    return res.status(201).json({
      success: true,
      message: "Client registered successfully",
      client,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "A client with this national ID already exists",
      });
    }

    console.error("Register client error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to register client",
    });
  }
};

const getClients = async (req, res) => {
  try {
    const adminId = req.admin.id;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 10, 1),
      100
    );

    const result = await getClientsByAdmin(adminId, page, limit);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Get clients error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve clients",
    });
  }
};
const getClient = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { id } = req.params;

    const client = await getClientById(id, adminId);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    return res.status(200).json({
      success: true,
      client,
    });
  } catch (error) {
    console.error("Get client error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve client",
    });
  }
};

const editClient = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { id } = req.params;
    const { names, nationalId, telephone, address } = req.body;

    if (!names || !nationalId || !telephone || !address) {
      return res.status(400).json({
        success: false,
        message: "All client fields are required",
      });
    }

    const client = await updateClient({
      id,
      adminId,
      names,
      nationalId,
      telephone,
      address,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "A client with this national ID already exists",
      });
    }

    console.error("Update client error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update client",
    });
  }
};

const removeClient = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { id } = req.params;

    const client = await deleteClient(id, adminId);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Delete client error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete client",
    });
  }
};

module.exports = {
  registerClient,
  getClients,
  getClient,
  editClient,
  removeClient,
};