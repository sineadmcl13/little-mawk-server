const express = require('express')
const mockRoutes = express.Router()
const rulesEngine = require('../services/rulesEngine')
const logger = require('../config/logging');

mockRoutes.get('/*', function(req, res) {
    logger.info('Received request from ' + req.path)
    let facts = {
        endpoint: req.path
    }

    rulesEngine.run(facts)
    .then(( ruleResults ) => {
        
        ruleResults.failureResults.forEach(failureResult => {
            logger.debug('Failed to match rule: ' + failureResult.name)
        })

        ruleResults.results.forEach(result => {
            logger.debug('Correctly matched rule: ' + result.name)
        })
        
        ruleResults.results.map(result => {
            logger.info('Returning response from rule: ' + result.name)
            res.status(result.event.params.code).send(result.event.params.body)
        });

    })
    .catch(err => console.log("Promise Reject: " + err));
});


module.exports = mockRoutes;