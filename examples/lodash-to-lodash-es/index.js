const core = require('../../src/index')
const path = require('path')

const transformPath = path.resolve(__dirname, './transform.js')
const paths = [path.resolve(__dirname, './input/atom-import.js')]

core.run(transformPath, paths)
