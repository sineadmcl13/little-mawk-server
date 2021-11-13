const express = require('./services/app')
const app = express()
const port = 3000
const morgan = require('morgan');
const logger = require('./config/logging');

//FIXME: this doesnt seem to be writing to file yet 
app.use(morgan("combined", { stream: logger.stream.write }));

app.use("/", require('./routes/mockRoutes'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})