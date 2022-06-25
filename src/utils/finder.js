const findImportDeclaration = (source, j, importSourceValue) => {
  const root = j(source)
  return root
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === importSourceValue)
}

module.exports = {
  findImportDeclaration
}
