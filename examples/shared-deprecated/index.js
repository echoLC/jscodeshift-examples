const core = require('../../src/index')
const path = require('path')
const fs = require('fs')

const transformPath = path.resolve(__dirname, './transform.js')

fs.readdir(path.resolve(__dirname, './input'), (err, files) => {
  if (err) {
    console.error(err.message)
    return
  }

  files.forEach((file) => {
    core.run(transformPath, [path.resolve(__dirname, `./input/${file}`)])
  })
})
