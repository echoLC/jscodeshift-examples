const { run: jscodeshift } = require('jscodeshift/src/Runner')

const defaultOptions = {
  dry: true,
  print: true,
  verbose: 1
}

async function run(transformPath, paths, options = defaultOptions) {
  const source = await jscodeshift(transformPath, paths, options)

  console.log(source)

  return source
}

module.exports = run
