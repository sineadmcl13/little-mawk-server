const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon')
const validator = require('../../services/rulesValidator')
const rulesEngine = require('../../services/rulesEngine');
const testInputValues = require('./rulesEngineTestInputs')

describe("rulesEngine", () => {
  context("addDefaultErrorRule", () => {
    it("should add default error rule when rules fail validation", () => {
      let stub = sinon.stub(validator, 'isRuleSetValid').returns(false);

      let requestRules = rulesEngine.build();
      assert.equal(requestRules.rules.length, 1)
      
      let errorRule = requestRules.rules.pop();
      assert.equal(errorRule.name, 'errorRule')
      assert.equal(errorRule.ruleEvent.params.code, 500)
      assert.equal(errorRule.ruleEvent.type, 'response')

      stub.restore();
    });

    afterEach(function () {
      sinon.restore();
    });

  });

  context("addParsedRules", () => {
    it("should fall back to default rules if none provided", () => {

      let requestRules = rulesEngine.build();
      assert.equal(requestRules.rules.length, 1)
      
      let defaultRule = requestRules.rules.pop();
      assert.equal(defaultRule.name, 'defaultRule')
      assert.equal(defaultRule.ruleEvent.params.code, 200)
      assert.equal(defaultRule.ruleEvent.type, 'response')
    });
    
    it("should correctly add validated rules to rulesEngine", () => {
      let requestRules = rulesEngine.build(testInputValues.testInputSingleRule);
      assert.equal(requestRules.rules.length, 1)
      
      let defaultRule = requestRules.rules.pop();
      assert.equal(defaultRule.name, 'rule1')
      assert.equal(defaultRule.ruleEvent.params.code, 202)
      assert.equal(defaultRule.ruleEvent.params.body, 'Test server response')
      assert.equal(defaultRule.ruleEvent.type, 'response')
    })
  })

});