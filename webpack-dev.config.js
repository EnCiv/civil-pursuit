const path = require('path')
const civilDevConfig = require('civil-server/webpack-dev.config')
const cloneDeep = require('lodash').cloneDeep
module.exports = cloneDeep(civilDevConfig)
module.exports.context = path.resolve(__dirname, 'app')
module.exports.output.path = path.join(__dirname, 'assets/webpack')
module.exports.resolve.extensions = ['.*', '.js', '.jsx'] // this change needs to be made to civil-server in future
module.exports.module.rules.push({
  test: /\.css$/i,
  use: 'css-loader',
})