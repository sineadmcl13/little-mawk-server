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

if(process.env.TEST){
  //Don't write to file when running tests
  configuredTransports = [ consoleTransport ]
}

const logger = createLogger({
  level: 'debug',
  transports: configuredTransports,
  exitOnError: false
});
module.exports = logger;
