const express = require('./services/app')
const app = express()
const port = 8080
const morgan = require('morgan');
const logger = require('./config/logging');

//using the logger and its configured transports, to save the logs created by Morgan
const myStream = {
  write: (text) => {
      logger.info(text)
  }
}
app.use(morgan('combined', { stream: myStream }));

app.use("/", require('./routes/mockRoutes'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})