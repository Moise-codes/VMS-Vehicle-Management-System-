const fs = require("fs");

const path = require("path");

const pool = require("./database");


const schemaPath = path.join(__dirname, "schema.sql");

const schema = fs.readFileSync(schemaPath, "utf8");


async function initializeDatabase() {

  await pool.query(schema);

  console.log("Database tables initialized successfully");

}


module.exports = initializeDatabase;
