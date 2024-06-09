const JWT = require('../model/authentication');

function signupValidation(req, res, next) {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json({ error: 'Enter all necessary data' });
    }
    next();
}

function loginValidation(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Enter all necessary data' });
    }
    next();
}

function validateRequest(req, res, next) {
    const token = req.headers.auth;
    if (!JWT.verify(token)) {
        return res.status(401).json({ error: 'You are Not Authrized' });
    }
    const value = JWT.get(token);
    req.admin_id = value.id;
    next();
}

function checkDate(req, res, next) {
    const { test_name, test_timing, test_date } = req.body;
    if (!test_date || !test_timing || !test_name)
        return res.status(400).json({ error: 'Enter all necessary data' });
    
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    if (test_date <= formattedDate)
        return res.status(400).json({ error: 'Enter valid date' });
    next();
}

module.exports = { signupValidation, loginValidation, validateRequest, checkDate };