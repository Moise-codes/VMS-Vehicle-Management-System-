const pool = require("../config/database");

const createAssignment = async ({
  vehicleId,
  clientId,
  adminId,
  plateNumber,
}) => {
  const query = `
    INSERT INTO vehicle_assignments (
      vehicle_id,
      client_id,
      admin_id,
      plate_number
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      id,
      vehicle_id,
      client_id,
      admin_id,
      plate_number,
      assigned_at
  `;

  const result = await pool.query(query, [
    vehicleId,
    clientId,
    adminId,
    plateNumber,
  ]);

  return result.rows[0];
};

const getAssignmentsByAdmin = async (
  adminId,
  page = 1,
  limit = 10
) => {
  const offset = (page - 1) * limit;

  const dataQuery = `
    SELECT
      va.id,
      va.vehicle_id,
      va.client_id,
      va.admin_id,
      va.plate_number,
      va.assigned_at,
      v.chassis_number,
      v.manufacturer,
      v.model_name,
      c.names AS client_name,
      c.national_id AS client_national_id,
      c.telephone AS client_telephone
    FROM vehicle_assignments va
    INNER JOIN vehicles v ON va.vehicle_id = v.id
    INNER JOIN clients c ON va.client_id = c.id
    WHERE va.admin_id = $1
      AND v.admin_id = $1
      AND c.admin_id = $1
    ORDER BY va.assigned_at DESC
    LIMIT $2 OFFSET $3
  `;

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM vehicle_assignments va
    INNER JOIN vehicles v ON va.vehicle_id = v.id
    INNER JOIN clients c ON va.client_id = c.id
    WHERE va.admin_id = $1
      AND v.admin_id = $1
      AND c.admin_id = $1
  `;

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, [adminId, limit, offset]),
    pool.query(countQuery, [adminId]),
  ]);

  const total = Number(countResult.rows[0].total);

  return {
    assignments: dataResult.rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getAssignmentById = async (id, adminId) => {
  const query = `
    SELECT
      va.id,
      va.vehicle_id,
      va.client_id,
      va.admin_id,
      va.plate_number,
      va.assigned_at,
      v.chassis_number,
      v.manufacturer,
      v.manufacture_year,
      v.price,
      v.model_name,
      c.names AS client_name,
      c.national_id AS client_national_id,
      c.telephone AS client_telephone,
      c.address AS client_address
    FROM vehicle_assignments va
    INNER JOIN vehicles v ON va.vehicle_id = v.id
    INNER JOIN clients c ON va.client_id = c.id
    WHERE va.id = $1
      AND va.admin_id = $2
      AND v.admin_id = $2
      AND c.admin_id = $2
  `;

  const result = await pool.query(query, [id, adminId]);

  return result.rows[0];
};

const deleteAssignment = async (id, adminId) => {
  const query = `
    DELETE FROM vehicle_assignments
    WHERE id = $1 AND admin_id = $2
    RETURNING id
  `;

  const result = await pool.query(query, [id, adminId]);

  return result.rows[0];
};

module.exports = {
  createAssignment,
  getAssignmentsByAdmin,
  getAssignmentById,
  deleteAssignment,
};