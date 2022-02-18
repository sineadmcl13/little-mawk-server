exports.testInputSingleRule = {
  rules: [
    {
      ruleName: "rule1",
      request: {
        any: [
          {
            compare: "endpoint",
            value: "/no",
            operator: "equal"
          }
        ]
      },
      response: {
        code: 400,
        body: "Server error response"
      }
    }
  ]
}

exports.testInputSingleRuleWithAll = {
  rules: [
    {
      ruleName: "rule1",
      request: {
        all: [
          {
            compare: "endpoint",
            value: "/no",
            operator: "equal"
          },
          {
            compare: "endpoint",
            value: "/fail",
            operator: "equal"
          }
        ]
      },
      response: {
        code: 400,
        body: "Server error response"
      }
    },
  ]
}

exports.testInputSingleRuleWithAny = {
  rules: [
    {
      ruleName: "rule1",
      request: {
        any: [
          {
            compare: "endpoint",
            value: "/no",
            operator: "equal"
          },
          {
            compare: "endpoint",
            value: "/fail",
            operator: "equal"
          }
        ]
      },
      response: {
        code: 400,
        body: "Server error response"
      }
    }
  ]
}

exports.testInputMultipleRuleWithAny = {
  rules: [
    {
      ruleName: "rule1",
      request: {
        any: [
          {
            compare: "endpoint",
            value: "/no",
            operator: "equal"
          },
          {
            compare: "endpoint",
            value: "/fail",
            operator: "equal"
          }
        ]
      },
      response: {
        code: 400,
        body: "Server error response"
      }
    },
    {
      ruleName: "rule2",
      request: {
        any: [
          {
            compare: "endpoint",
            value: "/test",
            operator: "equal"
          },
          {
            compare: "endpoint",
            value: "/test2",
            operator: "equal"
          }
        ]
      },
      response: {
        code: 200,
        body: "Server response ok"
      }
    }
  ]
}

exports.testRequestCompareInvalidValue = {
  rules: [
    {
      ruleName: "rule1",
      request: {
        any: [
          {
            compare: "body",
            value: "/no",
            operator: "equal"
          }
        ]
      },
      response: {
        code: 400,
        body: "Server error response"
      }
    },
  ]
}