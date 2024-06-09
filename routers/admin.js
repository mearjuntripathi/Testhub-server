const router = require('express').Router();
const auth = require('./adminAuth');
const { validateRequest, checkDate } = require('../middlware/admin');
const { pastTest, allTest, getStudents, createTest } = require('../endpoints/admin');
const upload = require('../model/upload');

router.use('/auth', auth);

router.get('/past-test', validateRequest, pastTest);
router.get('/test-list', validateRequest, allTest);

router.post('/orginized-test', validateRequest, upload.single('csv-file'), checkDate, createTest);
router.get('/students-list', validateRequest, getStudents);

module.exports = router;