const express = require('express')
const mockRoutes = express.Router()
const rulesEngine = require('../services/rulesEngine')
const requestRules = rulesEngine.build();
const logger = require('../config/logging');

mockRoutes.get('/*', function(req, res) {
    logger.info(`Received request from ${req.path}`)
    let facts = {
        endpoint: req.path
    }

    requestRules
        .run(facts)
        .then(( ruleResults ) => {
        
            ruleResults.failureResults.forEach(failureResult => {
                logger.debug(`Failed to match rule: ${failureResult.name}`)
            })

            ruleResults.results.forEach(result => {
                logger.debug(`Correctly matched rule: ${result.name}`)
            })

            if(ruleResults.results.length == 0){
                logger.info(`No matching rules found for request: ${req.path}`)
                res.status(500).send(`No matching rule found for ${req.path}`)
            }
            
            ruleResults.results.map(result => {
                logger.info(`Returning response from rule: ${result.name}`)
                res.status(result.event.params.code).send(result.event.params.body)
            });
        })
        .catch(err => logger.error(`Promise Reject: ${err}`));
});


module.exports = mockRoutes;