const con = require('../model/db');
const { logDbErrorToFile } = require('../logs/log');

// Function to create a new admin
async function create(name, email, password) {
    const query = 'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)';
    return new Promise((resolve, reject) => {
        con.query(query, [name, email, password], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    logDbErrorToFile(err);
                    return reject(new Error('Email already exists'));
                }
                logDbErrorToFile(err);
                return reject(err);
            }
            const paddedId = String(result.insertId).padStart(4, '0');
            const adminId = `admin_${paddedId}`;
            resolve({ adminId, ...result });
        });
    });
}

// Function to verify an admin
async function verify(admin_id) {
    const query = 'UPDATE admins SET active = true WHERE admin_id = ?';
    return new Promise((resolve, reject) => {
        con.query(query, [admin_id], async (err, result) => {
            if (err) {
                logDbErrorToFile(err);
                return reject(err);
            }
            try {
                await createAdminTable(admin_id);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    });
}

// Function to authenticate an admin
async function authenticate(email, password) {
    const query = 'SELECT * FROM admins WHERE email = ?';
    return new Promise((resolve, reject) => {
        con.query(query, [email], (err, results) => {
            if (err) {
                logDbErrorToFile(err);
                return reject(err);
            }
            if (results.length === 0) {
                return resolve({ success: false, message: 'Invalid email or password' });
            }

            const admin = results[0];

            if (!admin.active) {
                return resolve({ success: false, message: 'Your account is not verified. Please verify your account.' });
            }

            // Assuming password comparison is done securely
            if (password !== admin.password) {
                return resolve({ success: false, message: 'Invalid email or password' });
            }

            resolve({ success: true, admin });
        });
    });
}

// Function to create an admin test table
async function createAdminTable(admin_id) {
    const query = `CREATE TABLE ?? (
        test_id VARCHAR(30) PRIMARY KEY NOT NULL,
        test_name VARCHAR(30) NOT NULL,
        questions JSON NOT NULL,
        timing INT NOT NULL,
        test_date DATE NOT NULL 
    )`;
    return new Promise((resolve, reject) => {
        con.query(query, [admin_id], (err, result) => {
            if (err) {
                logDbErrorToFile(err);
                return reject(err);
            }
            resolve(result);
        });
    });
}

// Check email exist or not
function emailExists(email) {
    const query = `SELECT 1 FROM admins WHERE email = ? LIMIT 1`;

    return new Promise((resolve, reject) => {
        con.query(query, [email], (err, result) => {
            if (err) {
                logDbErrorToFile(err);
                return reject(err);
            }
            if (result.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

// Update password of admin
function updatePassword(email, password){
    const query = 'UPDATE admins SET password = ? WHERE email = ?';
    return new Promise((resolve, reject) => {
        con.query(query, [password, email], (err, result) => {
            if (err) {
                logDbErrorToFile(err);
                return reject(err);
            }
            if (result.affectedRows > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

// Insert data in Admin table
async function createTest(admin_id, test_id, test_name, questions, timing, test_date) {
    const query = `INSERT INTO ?? (test_id, test_name, questions, timing, test_date) VALUES (?,?,?,?,?)`;
    return new Promise((resolve, reject) => {
        con.query(query, [admin_id, test_id, test_name, questions, timing, test_date], async (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    logDbErrorToFile(err);
                    return reject(new Error('Test already exists'));
                }
                logDbErrorToFile(err);
                return reject(err);
            }
            try {
                await createTestTable(test_id);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    });
}

// check testid is exist in db
function testExists(test_id, admin_id) {
    const query = `SELECT 1 FROM ?? WHERE test_id = ? LIMIT 1`;

    return new Promise((resolve, reject) => {
        con.query(query, [admin_id, test_id], (err, result) => {
            if (err) {
                logDbErrorToFile(err);
                return reject(err);
            }
            if (result.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

// Function to create a test result table
async function createTestTable(test_id) {
    const query = `CREATE TABLE ?? (
        email VARCHAR(255) PRIMARY KEY NOT NULL,
        status VARCHAR(15) NOT NULL DEFAULT 'not attend',
        response JSON,
        score INT NOT NULL DEFAULT 0
    );`;
    return new Promise((resolve, reject) => {
        con.query(query, [test_id], (err, result) => {
            if (err) {
                logDbErrorToFile(err);
                return reject(err);
            }
            resolve(result);
        });
    });
}


// Function to retrieve past tests for an admin
async function pastTable(admin_id) {
    const query = `SELECT test_id, test_name, test_date FROM ?? WHERE test_date < ? ORDER BY test_date DESC`;
    const currentDate = new Date().toISOString().split("T")[0];
    return new Promise((resolve, reject) => {
        con.query(query, [admin_id, currentDate], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    logDbErrorToFile(err);
                    return reject(new Error('Email already exists'));
                }
                logDbErrorToFile(err);
                return reject(err);
            }
            resolve(result);
        });
    });
}

// Function to retrieve past tests for an admin
async function allTable(admin_id) {
    const query = `SELECT test_id, test_name, test_date FROM ?? ORDER BY test_date DESC`;
    return new Promise((resolve, reject) => {
        con.query(query, [admin_id], (err, result) => {
            if (err) {
                logDbErrorToFile(err);
                return reject(err);
            }
            resolve(result);
        });
    });
}

function getStudents(test_id) {
    const query = `SELECT 
                        s.name,
                        s.email,
                        s.resume_link,
                        t.status,
                        t.score,
                        t.response
                    FROM 
                        students s
                    JOIN 
                        ?? t ON s.email = t.email
                        ORDER BY t.score DESC;
                    `;
    return new Promise((resolve, reject) => {
        con.query(query, [test_id], (err, result) => {
            if (err) {
                logDbErrorToFile(err);
                return reject(err);
            }
            resolve(result);
        });
    });
}

module.exports = { create, verify, authenticate, emailExists ,updatePassword, testExists, createTestTable, pastTable, allTable, createTest, getStudents };