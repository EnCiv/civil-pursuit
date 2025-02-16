const path = require('path')
const civilProdConfig = require('civil-server/webpack-prod.config')
const cloneDeep = require('lodash').cloneDeep
module.exports = cloneDeep(civilProdConfig)
module.exports.context = path.resolve(__dirname, 'app')
module.exports.output.path = path.join(__dirname, 'assets/webpack')
