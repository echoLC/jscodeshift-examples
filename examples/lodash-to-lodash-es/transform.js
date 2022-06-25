module.exports = function transform(fileInfo, api) {
  const j = api.jscodeshift
  const root = j(fileInfo.source)

  root
    .find(j.ImportDeclaration)
    .filter((path) => {
      return path.node.source.value.startsWith('lodash')
    })
    .forEach((path) => {
      const value = path.node.source.value
      const specifier = value.split('/')[1]
      let newImport

      if (specifier) {
        newImport = j.importDeclaration(
          [j.importSpecifier(j.identifier(specifier))],
          j.stringLiteral('lodash-es')
        )
      } else {
        newImport = j.importDeclaration(
          path.node.specifiers,
          j.stringLiteral('lodash-es')
        )
      }
      j(path).replaceWith(newImport)
    })

  const lodashEsImports = root
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === 'lodash-es')

  // 处理完后需要合并所有的 lodash-es import
  if (lodashEsImports.length > 1) {
    const specifiers = []
    lodashEsImports.forEach((path) => {
      specifiers.push(...path.node.specifiers)
    })

    const newImport = j.importDeclaration(
      specifiers,
      j.stringLiteral('lodash-es')
    )

    lodashEsImports.forEach((path, index) => {
      if (index === lodashEsImports.length - 1) {
        path.insertAfter(newImport)
      }
    })

    lodashEsImports.remove()
  }

  return root.toSource({ quote: 'single' })
}
