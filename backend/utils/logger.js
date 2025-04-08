// Logger utility for D3V application
const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'info';
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
};

// Add colors to winston
winston.addColors(colors);

// Define format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    info => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.json()
);

// Define log directory
const logDir = 'logs';

// Create Winston logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format: fileFormat,
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error'
    }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log')
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log')
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log')
    })
  ]
});

// Add console transport in development mode
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat
    })
  );
}

// Export wrapper methods for easier usage
module.exports = {
  error: (message, meta = {}) => logger.error(message, { meta }),
  warn: (message, meta = {}) => logger.warn(message, { meta }),
  info: (message, meta = {}) => logger.info(message, { meta }),
  http: (message, meta = {}) => logger.http(message, { meta }),
  debug: (message, meta = {}) => logger.debug(message, { meta })
};