const fs = require('fs');
const path = require('path');

// Utility function to log errors to a specified file
const logErrorToFile = (filePath = './logs/server.log', error) => {
    const logEntry = `${new Date().toISOString()} - ${error.stack || error}\n`;
    fs.appendFileSync(filePath, logEntry, 'utf8', (err) => {
        if (err) {
            console.error('Failed to write to log file', err);
        }
    });
};

// Function to log database errors
const logDbErrorToFile = (error) => {
    const logFilePath = path.join(__dirname, 'db.log');
    logErrorToFile(logFilePath, error);
};

const logFile = (logEntry)=>{
    logFilePath = './logs/log.txt';
    fs.appendFile(logFilePath, logEntry, 'utf8', (err) => {
        if (err) {
            console.error('Failed to write to log file', err);
        }
    });
}

module.exports = { logDbErrorToFile, logErrorToFile, logFile };
