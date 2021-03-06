const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, simple } = format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp}: ${level}: ${message}`;
});


const consoleTransport = new transports.Console({
  format: combine(
    colorize(),
    simple()
  )
});

const fileTransport = new transports.File({ 
  filename: './.logs/littlemawk.log', 
  format: combine(
    timestamp(),
    customFormat
  )
});

let configuredTransports = [
  fileTransport,
  consoleTransport
]

const logger = createLogger({
  level: 'debug',
  transports: configuredTransports,
  exitOnError: false,
  silent: process.env.TEST === 'true'
});

module.exports = logger;
