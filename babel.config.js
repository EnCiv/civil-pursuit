// use a common babel.config across this project, customize below if necessary
const commonConfig = require('civil-client/babel.config')
module.exports = function (api) {
  // Evaluate or spread the external configuration
  const resolvedConfig = typeof commonConfig === 'function' ? commonConfig(api) : commonConfig

  return {
    ...resolvedConfig,
    // Add any local overrides or additional plugins/presets here
  }
}
