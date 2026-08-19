const pool = require("../config/database");

const createVehicle = async ({
  adminId,
  chassisNumber,
  manufacturer,
  manufactureYear,
  price,
  modelName,
}) => {
  const query = `
    INSERT INTO vehicles (
      admin_id,
      chassis_number,
      manufacturer,
      manufacture_year,
      price,
      model_name
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      admin_id,
      chassis_number,
      manufacturer,
      manufacture_year,
      price,
      model_name,
      created_at
  `;

  const result = await pool.query(query, [
    adminId,
    chassisNumber,
    manufacturer,
    manufactureYear,
    price,
    modelName,
  ]);

  return result.rows[0];
};

const getVehiclesByAdmin = async (adminId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const dataQuery = `
    SELECT
      id,
      admin_id,
      chassis_number,
      manufacturer,
      manufacture_year,
      price,
      model_name,
      created_at,
      updated_at
    FROM vehicles
    WHERE admin_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM vehicles
    WHERE admin_id = $1
  `;

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, [adminId, limit, offset]),
    pool.query(countQuery, [adminId]),
  ]);

  const total = Number(countResult.rows[0].total);

  return {
    vehicles: dataResult.rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getVehicleById = async (id, adminId) => {
  const query = `
    SELECT
      id,
      admin_id,
      chassis_number,
      manufacturer,
      manufacture_year,
      price,
      model_name,
      created_at,
      updated_at
    FROM vehicles
    WHERE id = $1 AND admin_id = $2
  `;

  const result = await pool.query(query, [id, adminId]);

  return result.rows[0];
};

const updateVehicle = async ({
  id,
  adminId,
  chassisNumber,
  manufacturer,
  manufactureYear,
  price,
  modelName,
}) => {
  const query = `
    UPDATE vehicles
    SET
      chassis_number = $1,
      manufacturer = $2,
      manufacture_year = $3,
      price = $4,
      model_name = $5,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $6 AND admin_id = $7
    RETURNING
      id,
      admin_id,
      chassis_number,
      manufacturer,
      manufacture_year,
      price,
      model_name,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [
    chassisNumber,
    manufacturer,
    manufactureYear,
    price,
    modelName,
    id,
    adminId,
  ]);

  return result.rows[0];
};

const deleteVehicle = async (id, adminId) => {
  const query = `
    DELETE FROM vehicles
    WHERE id = $1 AND admin_id = $2
    RETURNING id
  `;

  const result = await pool.query(query, [id, adminId]);

  return result.rows[0];
};

module.exports = {
  createVehicle,
  getVehiclesByAdmin,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};