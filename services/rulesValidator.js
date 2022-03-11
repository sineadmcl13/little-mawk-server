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
  patternProperties: { 
    "any|all": {
      type: "array",
        items: {
          $ref: "/RequestCondition"
        }
    }
  }
};

const requestCondition = {
  id: "/RequestCondition",
  type: "object",
  properties: {
    compare: {
      "enum": [
        "endpoint"
      ],
      required: true
    },
    value: {
      type: "string",
      required: true
    },
    operator: {
      "enum": [
        "equal"
      ],
      required: true
    }
  },
  additionalProperties: false
}

const response = {
  id: "/Response",
  type: "object",
  properties: {
    code: {
      type: "integer",
      required: true
    },
    body: {
      type: "string",
      required: true
    }
  },
  additionalProperties: false
};

// https://github.com/tdegrunt/jsonschema/blob/master/examples/ref.js
const v = new Validator();
v.addSchema(rule, '/Rule');
v.addSchema(request, '/Request');
v.addSchema(requestCondition, '/RequestCondition')
v.addSchema(response, '/Response');


function isRuleSetValid(rulesToValidate){
  let validationResult = v.validate(rulesToValidate, rules);
  if (validationResult.errors.length > 0) { 
    logger.error("Failed to parse rules.");
    validationResult.errors.forEach(err => logger.error(err.toString()))
    return false;
  } else {
    logger.info("Rules parsed a-ok")
    return true;
  }
}

module.exports.isRuleSetValid = isRuleSetValid;