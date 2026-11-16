'use strict'
// CJS override for test-storybook jest config.
// The ejected template uses ESM (export default); Jest can require() CJS directly.
// We override the stories transform to use our CJS wrapper instead of the
// ESM-only playwright/transform.js.
const { getJestConfig } = require('@storybook/test-runner')
const path = require('path')

const testRunnerConfig = getJestConfig()

module.exports = {
  ...testRunnerConfig,
  transform: {
    ...testRunnerConfig.transform,
    // Replace ESM transform.js (assertSyncTransformer fails) with CJS wrapper
    '^.+\\.(story|stories)\\.[jt]sx?$': path.resolve(__dirname, '.storybook/test-runner-transform.js'),
  },
}
