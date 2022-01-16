const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, simple } = format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp}: ${level}: ${message}`;
});

const logger = createLogger({
  level: 'debug',
  transports: [
    new transports.File({ 
      filename: './.logs/littlemawk.log', 
      format: combine(
        timestamp(),
        customFormat
      )
    }),
    new transports.Console({
      format: combine(
        colorize(),
        simple()
      )
    })
  ],
  exitOnError: false
});
module.exports = logger;
