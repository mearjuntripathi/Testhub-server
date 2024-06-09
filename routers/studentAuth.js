const router = require('express').Router();
const { login, signup, verify } = require('../endpoints/student');
const { loginValidation, signupValidation } = require('../middlware/student');


router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.get('/verify', verify);

module.exports = router;