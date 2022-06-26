const { atomSharedMap, sharedSource } = require('./constants')

module.exports = function (fileInfo, api) {
  const j = api.jscodeshift
  const root = j(fileInfo.source)

  const appShellSharedImports = root
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === sharedSource)

  const newImports = []
  let resetSpecifiers = []
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

  if (resetSpecifiers.length) {
    resetSpecifiers.forEach((s) => {
      root
        .find(j.MemberExpression, {
          object: {
            type: 'Identifier',
            name: s.local.name
          }
        })
        .forEach((path) => {
          if (path.node.property) {
            const name = path.node.property.name
            const key = `${s.local.name}.${name}`
            const atomShared = atomSharedMap[key]
            if (atomShared) {
              if (atomShared.module) {
                newImports.push(
                  j.importDeclaration(
                    [j.importNamespaceSpecifier(j.identifier(name))],
                    j.stringLiteral(atomShared.value)
                  )
                )
              } else {
                let newSpecifier
                if (atomShared.default) {
                  newSpecifier = j.importDefaultSpecifier(j.identifier(name))
                } else {
                  newSpecifier = j.importSpecifier(j.identifier(name))
                }
                newImports.push(
                  j.importDeclaration(
                    [newSpecifier],
                    j.stringLiteral(atomShared.value)
                  )
                )
              }
              // 更新 resetSpecifiers
              resetSpecifiers = resetSpecifiers.filter(
                (resetS) => s.local.name !== resetS.local.name
              )
              const parentNode = path.parent.node

              if (parentNode.object && parentNode.object.property.name) {
                j(path.parent).replaceWith(
                  j.memberExpression(
                    j.identifier(parentNode.object.property.name),
                    j.identifier(parentNode.property.name)
                  )
                )
              } else {
                if (parentNode.type === 'CallExpression') {
                  j(path.parent).replaceWith(
                    j.callExpression(
                      j.identifier(parentNode.callee.property.name),
                      parentNode.arguments
                    )
                  )
                }
              }
            }
          }
        })
    })
  }

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
