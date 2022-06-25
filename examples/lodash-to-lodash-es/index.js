const core = require('../../src/index')
const path = require('path')

const transformPath = path.resolve(__dirname, './transform.js')
const paths1 = [path.resolve(__dirname, './input/atom-import.js')]
const paths2 = [path.resolve(__dirname, './input/mixed-import.js')]
const paths3 = [path.resolve(__dirname, './input/specifier-import.js')]

core.run(transformPath, paths1)
core.run(transformPath, paths2)
core.run(transformPath, paths3)
