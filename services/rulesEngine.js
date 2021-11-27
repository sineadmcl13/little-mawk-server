//this will read the json file into the ruleConfig object at startup
const rulesConfig = require('../config/rules.json')
const { Engine } = require('json-rules-engine')
const rulesEngine = new Engine()
const logger = require('../config/logging');
const Validator = require('jsonschema').Validator;

const rules = {
  "id": "/Rules",
  "type": "object",
  "properties": {
    "rules": {
      "type": "array",
      "items": {"$ref": "/Rule"}
    }
  },
  "additionalProperties": false
};

const rule = {
  "id": "/Rule",
  "type": "object",
  "properties": {
    "ruleName": {"type": "string"},
    "request": {
      "type": "object",
      "$ref": "/Request"
    },
    "response" : {
      "$ref": "/Response",
      "required": true
    }
  },
  "additionalProperties": false
};

const request = {
  "id": "/Request",
  "type": "object",
  "properties": { 
    "anyOf" : [
    {
      "any": {
        "type": "array",
        "items": {"$ref": "/RequestCondition"}
      }
    },
    {
      "all" : {
        "type": "array",
        "items": {"$ref": "/RequestConditon"}
      }
    }
  ]}
};

const requestCondition = {
  "id": "/RequestCondition",
  "type": "object",
  "properties": {
    "compare": {"type": "string"},
    "value": {"type": "string"},
    "operator": {"type": "string"}
  },
  "additionalProperties": false
}

const response = {
  "id": "/Response",
  "type": "object",
  "properties": {
    "code": {"type": "integer"},
    "body": {"type": "string"}
  },
  "additionalProperties": false
};


function addParsedRules() { 
  rulesConfig.rules.forEach( pr => {
    let newRule = {}
    newRule.name = pr.ruleName
    newRule.event = {
      type: 'response',
      params: {
        code: pr.response.code,
        body: pr.response.body
       }
    } 
    newRule.conditions = {}

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

// https://github.com/tdegrunt/jsonschema/blob/master/examples/ref.js
var v = new Validator();
v.addSchema(rule, '/Rule');
v.addSchema(request, 'Request');
v.addSchema(response, 'Response');
var validationResult = v.validate(rulesConfig, rules);

if (validationResult.errors.length > 0) { 
  logger.err("Failed to parse rules.");
  logger.err(validationResult.errors);
  addDefaultErrorRule()
} else {
  logger.info("Rules parsed a-ok")
  addParsedRules()
}


module.exports = rulesEngine;