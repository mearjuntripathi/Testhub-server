require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('./routers/admin');
const { logFile } = require('./logs/log');

const student = require('./routers/student');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specific HTTP methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers
    res.setHeader('Access-Control-Expose-Headers', 'auth'); // Expose the 'auth' header to the client
    next();
});

app.use((req, res, next) => {
    const logEntry = `| IP: ${req.ip} || Path: ${req.path} || Date: ${new Date().toISOString()} |\n`;

    logFile(logEntry);
    next();
});

app.use(cors());
app.use('/admin', admin);
app.use('/student', student);

app.get('/',(req,res)=>{
    res.end();
});

app.listen(port, console.log(`Server Listening on: http://localhost:${port}`));