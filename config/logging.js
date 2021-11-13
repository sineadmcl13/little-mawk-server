const winston = require('winston');
// creates a new Winston Logger
const logger = new winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.File({ 
      filename: './.logs/littlemawk.log', 
      format: winston.format.simple()
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
  exitOnError: false
});
module.exports = logger;
