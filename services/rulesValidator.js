const { Validator } = require('jsonschema');
const logger = require('../config/logging');

const rules = {
  id: "/Rules",
  type: "object",
  properties: {
    rules: {
      type: "array",
      items: {
        $ref: "/Rule"
      }
    }
  },
  additionalProperties: false
}

const rule = {
  id: "/Rule",
  type: "object",
  properties: {
    ruleName: {
      type: "string"
    },
    request: {
      type: "object",
      $ref: "/Request"
    },
    response : {
      $ref: "/Response",
      required: true
    }
  },
  additionalProperties: false
};

const request = {
  id: "/Request",
  type: "object",
  properties: { 
    anyOf : [
    {
      any: {
        type: "array",
        items: {
          $ref: "/RequestCondition"
        }
      }
    },
    {
      all : {
        type: "array",
        items: {
          $ref: "/RequestConditon"
        }
      }
    }
  ]}
};

const requestCondition = {
  id: "/RequestCondition",
  type: "object",
  properties: {
    compare: {
      type: "string"
    },
    value: {
      type: "string"
    },
    operator: {
      type: "string"
    }
  },
  additionalProperties: false
}

const response = {
  id: "/Response",
  type: "object",
  properties: {
    code: {
      type: "integer"
    },
    body: {
      type: "string"
    }
  },
  additionalProperties: false
};

// https://github.com/tdegrunt/jsonschema/blob/master/examples/ref.js
const v = new Validator();
v.addSchema(rule, '/Rule');
v.addSchema(request, 'Request');
v.addSchema(response, 'Response');


function isRuleSetValid(rulesToValidate){
  let validationResult = v.validate(rulesToValidate, rules);
  if (validationResult.errors.length > 0) { 
    logger.error("Failed to parse rules.");
    logger.error(validationResult.errors);
    return false;
  } else {
    logger.info("Rules parsed a-ok")
    return true;
  }
}

module.exports.isRuleSetValid = isRuleSetValid;