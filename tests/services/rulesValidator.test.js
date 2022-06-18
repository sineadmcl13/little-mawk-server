const chai = require('chai');
const assert = chai.assert;
const rulesValidator = require('../../services/rulesValidator');
const testInputValues = require('./rulesValidatorTestInputs')
const sinon = require('sinon');
const logger = require('../../config/logging');

describe("rulesValidator", () => {
  context("isRuleSetValid", () => {
    
    context("valid test inputs", () => {
      const tests = [
        { description: "should pass for single rule", input: testInputValues.testInputSingleRule },
        { description: "should pass for rule using 'all'", input: testInputValues.testInputSingleRuleWithAll },
        { description: "should pass for rule using 'any", input: testInputValues.testInputSingleRuleWithAny },
        { description: "should pass for multiple rules", input: testInputValues.testInputMultipleRuleWithAny}
      ];
    
      tests.forEach(({description, input}) => {
        it(`${description}`, ()=> {
          assert.isTrue(rulesValidator.isRuleSetValid(input));
        });
      });
    })

    context("invalid test inputs", ()=>{

      let spy;

      beforeEach(() => {
        spy = sinon.spy(logger, 'error')
      })

      afterEach(()=> {
        spy.restore();
      });

      it("should fail for invalid json format input", ()=> {
        assert.isFalse(rulesValidator.isRuleSetValid("{\"someField\": \"noClosingBracket\""));
      });
  
      it("should fail for empty valid json input", ()=> {
        assert.isFalse(rulesValidator.isRuleSetValid("{}"));
      });
  
      it("should fail if 'compare' field is not a valid type", () => {
        assert.isFalse(rulesValidator.isRuleSetValid(testInputValues.testRequestCompareInvalidValue));
        assert.isTrue(spy.calledWith('instance.rules[0].request.any[0].compare is not one of enum values: endpoint'));
      });

      it("should fail if 'operator' field is not a valid type", (done) => {
        assert.isFalse(rulesValidator.isRuleSetValid(testInputValues.testRequestOperatorInvalidValue));
        assert.isTrue(spy.calledWith('instance.rules[0].request.any[0].operator is not one of enum values: equal'));
        done();
      });

      it("should fail if 'response' object does not contain required body field", (done) => {
        assert.isFalse(rulesValidator.isRuleSetValid(testInputValues.testResponseMissingBodyField));
        assert.isTrue(spy.calledWith('instance.rules[0].response.body is required'));
        done();
      });

      it("should fail if 'response' object does not contain required code field", (done) => {
        assert.isFalse(rulesValidator.isRuleSetValid(testInputValues.testResponseMissingCodeField));
        assert.isTrue(spy.calledWith('instance.rules[0].response.code is required'));
        done();
      });
    })    
  })
});