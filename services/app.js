const express = require('express')

let app
module.exports = () => {
  app = app || express()
  return app
}
