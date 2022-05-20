const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon')
const validator = require('../../services/rulesValidator')
const rulesEngine = require('../../services/rulesEngine');
const testInputValues = require('./rulesEngineTestInputs')

describe("rulesEngine", () => {
  context("addDefaultErrorRule", () => {
    it("should add default error rule when rules fail validation", () => {
      let stub = sinon.stub(validator, 'isRuleSetValid').returns(false);

      let requestRules = rulesEngine.build();
      expect(requestRules.rules.length).to.equal(1)
      
      let errorRule = requestRules.rules.pop();
      expect(errorRule.name).to.equal('errorRule')
      expect(errorRule.ruleEvent.params.code).to.equal(500)
      expect(errorRule.ruleEvent.type).to.equal('response')

      stub.restore();
    });

    afterEach(function () {
      sinon.restore();
    });

  });

  context("addParsedRules", () => {
    it("should fall back to default rules if none provided", () => {

      let requestRules = rulesEngine.build();
      expect(requestRules.rules.length).to.equal(1)
      
      let defaultRule = requestRules.rules.pop();
      expect(defaultRule.name).to.equal('defaultRule')
      expect(defaultRule.ruleEvent.params.code).to.equal(200)
      expect(defaultRule.ruleEvent.type).to.equal('response')
    });
    
    it("should correctly add validated rules to rulesEngine", () => {
      let requestRules = rulesEngine.build(testInputValues.testInputSingleRule);
      expect(requestRules.rules.length).to.equal(1)
      
      let defaultRule = requestRules.rules.pop();
      expect(defaultRule.name).to.equal('rule1')
      expect(defaultRule.ruleEvent.params.code).to.equal(202)
      expect(defaultRule.ruleEvent.params.body).to.equal('Test server response')
      expect(defaultRule.ruleEvent.type).to.equal('response')
    })
  })

});