const router = require('express').Router();
const auth = require('./studentAuth');

const { verifyStudent } = require('../middlware/student');
const { submitResponse, makeSuspend } = require('../endpoints/student');

router.use('/auth', auth);

router.post('/submit-response', verifyStudent, submitResponse);
router.get('/suspend', verifyStudent, makeSuspend);

module.exports = router;