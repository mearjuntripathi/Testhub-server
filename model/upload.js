const multer = require('multer');
const path = require('path');

// Set up storage destination and filename
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = upload;