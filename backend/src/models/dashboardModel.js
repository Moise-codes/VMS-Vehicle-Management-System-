const pool = require("../config/database");

const getDashboardStats = async (adminId) => {
  const query = `
    SELECT
      (SELECT COUNT(*)
       FROM clients
       WHERE admin_id = $1) AS total_clients,

      (SELECT COUNT(*)
       FROM vehicles
       WHERE admin_id = $1) AS total_vehicles,

      (SELECT COUNT(*)
       FROM vehicle_assignments
       WHERE admin_id = $1) AS total_assigned_vehicles,

      (SELECT COUNT(*)
       FROM vehicles v
       WHERE v.admin_id = $1
       AND NOT EXISTS (
         SELECT 1
         FROM vehicle_assignments va
         WHERE va.vehicle_id = v.id
         AND va.admin_id = $1
       )) AS total_unassigned_vehicles
  `;

  const result = await pool.query(query, [adminId]);

  return {
    totalClients: Number(result.rows[0].total_clients),
    totalVehicles: Number(result.rows[0].total_vehicles),
    totalAssignedVehicles: Number(
      result.rows[0].total_assigned_vehicles
    ),
    totalUnassignedVehicles: Number(
      result.rows[0].total_unassigned_vehicles
    ),
  };
};

module.exports = {
  getDashboardStats,
};