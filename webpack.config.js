const path = require('path')
const webpack = require('webpack')
const civilConfig = require('civil-server/webpack.config')
const cloneDeep = require('lodash').cloneDeep

const isDevelopment = process.env.NODE_ENV === 'development'

module.exports = cloneDeep(civilConfig)

// Override context and output for civil-pursuit
module.exports.context = path.resolve(__dirname, 'app')
module.exports.output.path = path.join(__dirname, 'assets/webpack')

// Override resolve aliases for civil-pursuit's React location
// This ensures all webpack code uses the single React copy at the project root
module.exports.resolve = module.exports.resolve || {}
module.exports.resolve.alias = module.exports.resolve.alias || {}
module.exports.resolve.alias['react'] = path.resolve(__dirname, 'node_modules/react')
module.exports.resolve.alias['react-dom'] = path.resolve(__dirname, 'node_modules/react-dom')
// tiny-invariant's ESM build imports 'process/browser' without the .js extension;
// webpack 5 fully-specified ESM resolution requires the extension, so alias it explicitly.
module.exports.resolve.alias['process/browser'] = require.resolve('process/browser.js')

// Add CSS loader for civil-pursuit
module.exports.module.rules.push({
  test: /\.css$/i,
  use: 'css-loader',
})
