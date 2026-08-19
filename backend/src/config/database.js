const {Pool}  = require("pg");

require("dotenv").config();

const pool = new Pool({

    connectionString: process.env.DATABASE_URL

})

pool.on("connect",()=>{

    console.log("PostgreSQL Database Connected Successfully!");

})

pool.on("error",(error)=>{

    console.log("PostgreSQL Database Connection Error!");

})

module.exports = pool;
