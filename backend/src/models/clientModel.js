const pool = require("../config/database");

const createClient = async ({
  adminId,
  names,
  nationalId,
  telephone,
  address,
}) => {
  const query = `
    INSERT INTO clients (
      admin_id,
      names,
      national_id,
      telephone,
      address
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, admin_id, names, national_id, telephone, address, created_at
  `;

  const result = await pool.query(query, [
    adminId,
    names,
    nationalId,
    telephone,
    address,
  ]);

  return result.rows[0];
};

const getClientsByAdmin = async (adminId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const dataQuery = `
    SELECT
      id,
      admin_id,
      names,
      national_id,
      telephone,
      address,
      created_at,
      updated_at
    FROM clients
    WHERE admin_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM clients
    WHERE admin_id = $1
  `;

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, [adminId, limit, offset]),
    pool.query(countQuery, [adminId]),
  ]);

  const total = Number(countResult.rows[0].total);

  return {
    clients: dataResult.rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getClientById = async (id, adminId) => {
  const query = `
    SELECT
      id,
      admin_id,
      names,
      national_id,
      telephone,
      address,
      created_at,
      updated_at
    FROM clients
    WHERE id = $1 AND admin_id = $2
  `;

  const result = await pool.query(query, [id, adminId]);

  return result.rows[0];
};

const updateClient = async ({
  id,
  adminId,
  names,
  nationalId,
  telephone,
  address,
}) => {
  const query = `
    UPDATE clients
    SET
      names = $1,
      national_id = $2,
      telephone = $3,
      address = $4,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $5 AND admin_id = $6
    RETURNING
      id,
      admin_id,
      names,
      national_id,
      telephone,
      address,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [
    names,
    nationalId,
    telephone,
    address,
    id,
    adminId,
  ]);

  return result.rows[0];
};

const deleteClient = async (id, adminId) => {
  const query = `
    DELETE FROM clients
    WHERE id = $1 AND admin_id = $2
    RETURNING id
  `;

  const result = await pool.query(query, [id, adminId]);

  return result.rows[0];
};

module.exports = {
  createClient,
  getClientsByAdmin,
  getClientById,
  updateClient,
  deleteClient,
};