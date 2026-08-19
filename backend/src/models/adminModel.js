const pool = require("../config/database");

const createAdmin = async ({
  names,
  email,
  phone,
  nationalId,
  passwordHash,
}) => {
  const query = `
    INSERT INTO admins (
      names,
      email,
      phone,
      national_id,
      password_hash
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, names, email, phone, national_id, created_at
  `;

  const values = [
    names,
    email,
    phone,
    nationalId,
    passwordHash,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const findAdminByEmail = async (email) => {
  const query = `
    SELECT *
    FROM admins
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0];
};

const findAdminById = async (id) => {
  const query = `
    SELECT id, names, email, phone, national_id, created_at
    FROM admins
    WHERE id = $1
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

module.exports = {
  createAdmin,
  findAdminByEmail,
  findAdminById,
};