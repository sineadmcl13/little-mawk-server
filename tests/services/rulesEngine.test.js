const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon')
const validator = require('../../services/rulesValidator')
const rulesEngine = require('../../services/rulesEngine');

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
});