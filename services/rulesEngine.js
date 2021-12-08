//this will read the json file into the ruleConfig object at startup
const rulesConfig = require('../config/rules.json')
const { Engine } = require('json-rules-engine')
const rulesEngine = new Engine()
const validator = require('./rulesValidator')
const logger = require('../config/logging');


function addParsedRules() { 
  rulesConfig.rules.forEach( pr => {
    let newRule = {
      name: pr.ruleName,
      event: {
        type: 'response',
        params: {
          code: pr.response.code,
          body: pr.response.body
         }
      },
      conditions: {}
    }
    

    if (typeof pr.request.all !== 'undefined') {
      newRule.conditions.all = []
      pr.request.all.forEach(condition => {
        newRule.conditions.all.push({
          fact: condition.compare,
          operator: condition.operator,
          value: condition.value
        })
      })
    }

    if (typeof pr.request.any !== 'undefined') {
      newRule.conditions.any = []
      pr.request.any.forEach(condition => {
        newRule.conditions.any.push({
          fact: condition.compare,
          operator: condition.operator,
          value: condition.value
        })
      })
    }

    logger.info(JSON.stringify(newRule, null, 2))
    rulesEngine.addRule( newRule )
  });

}

function addDefaultErrorRule() { 
  rulesEngine.addRule({
    conditions: {
      any: [
        //We want to match any request and return the same result
      ]
    },
    event: {  // define the event to fire when the conditions evaluate truthy
      type: 'response',
      params: {
        code: 500,
        body: 'Internal error. Failed to parse rules'
      }
    },
    name: "errorRule"
  })
}


if(validator.isRuleSetValid(rulesConfig)){
  addParsedRules();
} else {
  addDefaultErrorRule();
}

module.exports = rulesEngine;