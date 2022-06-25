const getCallIdentifierSelector = (call) => ({
  type: 'CallExpression',
  callee: {
    type: 'Identifier',
    name: call
  }
})

const getModuleCallsSelector = (moduleName, call) => ({
  type: 'CallExpression',
  callee: {
    type: 'MemberExpression',
    object: {
      type: 'Identifier',
      name: moduleName
    },
    property: {
      type: 'Identifier',
      name: call
    }
  }
})

module.exports = {
  getCallIdentifierSelector,
  getModuleCallsSelector
}
