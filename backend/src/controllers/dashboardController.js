const { getDashboardStats } = require("../models/dashboardModel");

const getDashboard = async (req, res) => {
  try {
    const adminId = req.admin.id;

    const stats = await getDashboardStats(adminId);

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Dashboard error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard statistics",
    });
  }
};

module.exports = {
  getDashboard,
};