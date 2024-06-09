const con = require('../model/db');
const { logDbErrorToFile } = require('../logs/log');

async function getTestData(admin_id, test_id) {
    const query = 'SELECT * FROM ?? WHERE test_id = ?';
    return new Promise((resolve, reject) => {
        con.query(query, [admin_id, test_id], (err, result) => {
            if (err) {
                logDbErrorToFile(err);
                return reject(err);
            }
            resolve(result);
        });
    });
}

async function adminExist(admin_id) {
    const query = 'SELECT * FROM admins WHERE admin_id = ? LIMIT 1';
    return new Promise((resolve, reject) => {
        con.query(query, [admin_id], (err, result) => {
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

async function checkEmail(email) {
    const query = 'SELECT * FROM students WHERE email = ? and active = true LIMIT 1';
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

async function checkEmailTest(email, test_id) {
    const query = 'SELECT status FROM ?? WHERE email = ? LIMIT 1'; // Assuming status column exists in the table
    return new Promise((resolve, reject) => {
        con.query(query, [test_id, email], (err, result) => {
            if (err) {
                logDbErrorToFile(err);
                return reject(err);
            }
            if (result.length > 0) {
                resolve(result[0].status); 
            } else {
                resolve(null);
            }
        });
    });
}


async function testExist(test_id, admin_id) {
    const query = 'SELECT * FROM ?? WHERE test_id = ? LIMIT 1';
    return new Promise((resolve, reject) => {
        con.query(query, [admin_id, test_id], (err, result) => {
            if (err) {
                logDbErrorToFile(err);
                return reject(err);
            }
            if (result.length > 0) {
                resolve(result);
            } else {
                resolve(false);
            }
        });
    });
}

async function addStudents(name, email, resume) {
    const query = 'INSERT INTO students (name, email, resume_link) VALUES (?, ?, ?)';
    return new Promise((resolve, reject) => {
        con.query(query, [name, email, resume], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    logDbErrorToFile(err);
                    return reject(new Error('Email already exists but not verified'));
                }
                logDbErrorToFile(err);
                return reject(err);
            }
            resolve(result);
        });
    });
}

async function verify(test_id, email) {
    const query = 'UPDATE students SET active = true WHERE email = ?';
    return new Promise((resolve, reject) => {
        con.query(query, [email], async (err, result) => {
            if (err) {
                logDbErrorToFile(err);
                return reject(err);
            }
            try {
                await addStudent(test_id, email);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    });
}

async function updateStudents(name, email, resume, test_id) {
    const query = 'UPDATE students SET name = ?, resume_link = ? WHERE email = ?';
    return new Promise((resolve, reject) => {
        con.query(query, [name, resume, email], async (err, result) => {
            if (err) {
                logDbErrorToFile(err);
                return reject(err);
            }
            try {
                await addStudent(test_id, email);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    });
}

async function addStudent(test_id, email) {
    const query = 'INSERT INTO ?? (email) VALUES (?)';
    return new Promise((resolve, reject) => {
        con.query(query, [test_id, email], (err, result) => {
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

async function makeSuspend(email, test_id) {
    const query = 'UPDATE ?? SET status=? WHERE email = ?';
    return new Promise((resolve, reject) => {
        con.query(query, [test_id, "suspend", email], (err, result) => {
            if (err) {
                logDbErrorToFile(err);
                return reject(err);
            }
            resolve(result);
        });
    });
}

async function submitResponse(email, test_id, score, response) {
    const query = 'UPDATE ?? SET status=?, score=?, response=? WHERE email = ?';
    return new Promise((resolve, reject) => {
        con.query(query, [test_id, "attend", score, response, email], (err, result) => {
            if (err) {
                logDbErrorToFile(err);
                return reject(err);
            }
            resolve(result);
        });
    });
}

module.exports = { getTestData, checkEmailTest, adminExist, checkEmail, testExist, addStudents, updateStudents, verify, makeSuspend, submitResponse };
