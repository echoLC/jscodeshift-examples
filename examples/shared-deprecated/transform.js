const { atomSharedMap, sharedSource } = require('./constants')

module.exports = function (fileInfo, api) {
  const j = api.jscodeshift
  const root = j(fileInfo.source)

  const appShellSharedImports = root
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === sharedSource)

  const newImports = []
  const resetSpecifiers = []
  appShellSharedImports.forEach((path) => {
    const specifiers = path.node.specifiers
    const deletedSpecifiers = []
    specifiers.forEach((specifier) => {
      const name = specifier.local.name
      const atomShared = atomSharedMap[name]
      if (atomShared) {
        let newSpecifier
        if (atomShared.default) {
          newSpecifier = j.importDefaultSpecifier(j.identifier(name))
        } else {
          newSpecifier = j.importSpecifier(j.identifier(name))
        }
        newImports.push(
          j.importDeclaration([newSpecifier], j.stringLiteral(atomShared.value))
        )
        deletedSpecifiers.push(specifier)
      }
    })

    specifiers.forEach((s) => {
      const resetSpecifier = deletedSpecifiers.find(
        (d) => d.local.name === s.local.name
      )
      if (!resetSpecifier) {
        resetSpecifiers.push(s)
      }
    })
  })

  if (newImports.length) {
    newImports.forEach((node) => {
      appShellSharedImports.at(0).insertAfter(node)
    })
  }

  if (resetSpecifiers.length) {
    appShellSharedImports.forEach((path) => {
      j(path).replaceWith(
        j.importDeclaration(resetSpecifiers, j.stringLiteral(sharedSource))
      )
    })
  } else {
    appShellSharedImports.forEach((path) => {
      j(path).remove()
    })
  }

  return root.toSource({ quote: 'single' })
}
