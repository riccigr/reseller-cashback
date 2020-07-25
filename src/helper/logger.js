const winston = require('winston');
const fs = require('fs');
const properties = require('../config/properties').properties;

if (!fs.existsSync(properties.winston.logDir.toString())) {
  fs.mkdirSync(properties.winston.logDir);
}

module.exports = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: properties.winston.level,
      filename: properties.winston.filename,
      maxsize: properties.winston.maxsize,
      maxFiles: properties.winston.maxFiles,
      handleExceptions: properties.winston.handleExceptions,
      humanReadableUnhandleExceptions: properties.winston.humanReadableUnhandleExceptions
    }),
    new winston.transports.Console()
  ]
});
