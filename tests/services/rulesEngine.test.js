const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon')
const validator = require('../../services/rulesValidator')


describe("rulesEngine", () => {
  context("addDefaultErrorRule", () => {
    context("default error rule added when rules fail validation", () => {
      let stub = sinon.stub(validator, 'isRuleSetValid').returns(false);

      let rulesEngine = require('../../services/rulesEngine');
      expect(rulesEngine.rules.length).to.equal(1)
      
      let errorRule = rulesEngine.rules.pop();
      expect(errorRule.name).to.equal('errorRule')
      expect(errorRule.ruleEvent.params.code).to.equal(500)
      expect(errorRule.ruleEvent.type).to.equal('response')

      stub.restore();
    });
  });
});