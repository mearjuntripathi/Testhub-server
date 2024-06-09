const router = require('express').Router();
const { signup, verify, login, forgetPassword, updatePassword } = require('../endpoints/admin');
const { signupValidation, loginValidation } = require('../middlware/admin');

router.post('/signup', signupValidation, signup);
router.get('/verify', verify);
router.post('/login', loginValidation, login);
router.post('/forget-password', forgetPassword);
router.post('/update-password', updatePassword);

module.exports = router;