const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../logs');
const LOG_FILE = path.join(LOG_DIR, 'error.log');

function logError(error) {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
  }
  const logEntry = `[${new Date().toISOString()}] ${error}\n`;
  fs.appendFileSync(LOG_FILE, logEntry);
}

module.exports = logError;

