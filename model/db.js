const mysql = require('mysql2');
const { logDbErrorToFile } = require('../logs/log');
require('dotenv').config();

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

con.connect(function (err) {
    if (err){
        logDbErrorToFile(err);
        throw err;
    }
    console.log("Connected to the database!");
});

module.exports = con;
