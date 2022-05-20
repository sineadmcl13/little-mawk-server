exports.testInputSingleRule = {
  rules: [
    {
      ruleName: "rule1",
      request: {
        any: [
          {
            compare: "endpoint",
            value: "/test",
            operator: "equal"
          }
        ]
      },
      response: {
        code: 202,
        body: "Test server response"
      }
    }
  ]
}