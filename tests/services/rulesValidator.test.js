const chai = require('chai');
const expect = chai.expect;
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
          expect(rulesValidator.isRuleSetValid(input)).to.be.true;
        });
      });
    })

    context("invalid test inputs", ()=>{


      let spy = sinon.spy(logger, 'error')
      afterEach(function() {
        spy.restore();
      });

      it("should fail for invalid json format input", ()=> {
        expect(rulesValidator.isRuleSetValid("{\"someField\": \"noClosingBracket\"")).to.be.false;
      });
  
      it("should fail for empty valid json input", ()=> {
        expect(rulesValidator.isRuleSetValid("{}")).to.be.false;
      });
  
      it("should fail if 'compare' field is not a valid type", (done) => {
        expect(rulesValidator.isRuleSetValid(testInputValues.testRequestCompareInvalidValue)).to.be.false;
        expect(spy.calledWith('instance.rules[0].request.any[0].compare is not one of enum values: endpoint'));
        done();
      });

      it("should fail if 'operator' field is not a valid type", (done) => {
        expect(rulesValidator.isRuleSetValid(testInputValues.testRequestOperatorInvalidValue)).to.be.false;
        expect(spy.calledWith('instance.rules[0].request.any[0].operator is not one of enum values: equal'));
        done();
      });

      it("should fail if multiple 'any' blocks use same compare value");
      it("should fail if 'response' object does not contain required fields");

    })    
  })
});