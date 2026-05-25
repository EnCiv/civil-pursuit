const path = require('path')
const civilDevConfig = require('civil-server/webpack-dev.config')
const cloneDeep = require('lodash').cloneDeep
module.exports = cloneDeep(civilDevConfig)
module.exports.context = path.resolve(__dirname, 'app')
module.exports.output.path = path.join(__dirname, 'assets/webpack')
module.exports.resolve.extensions = ['.*', '.js', '.jsx'] // this change needs to be made to civil-server in future
// Override the civil-server alias which points to civil-server/node_modules/react (non-existent);
// ensure all webpack code uses the single React copy at the project root.
module.exports.resolve.alias['react'] = path.resolve(__dirname, 'node_modules/react')
module.exports.resolve.alias['react-dom'] = path.resolve(__dirname, 'node_modules/react-dom')
// tiny-invariant's ESM build imports 'process/browser' without the .js extension;
// webpack 5 fully-specified ESM resolution requires the extension, so alias it explicitly.
module.exports.resolve.alias['process/browser'] = require.resolve('process/browser')
module.exports.module.rules.push({
  test: /\.css$/i,
  use: 'css-loader',
})
