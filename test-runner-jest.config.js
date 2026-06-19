// CJS version of the ejected test-runner jest config.
// The default test-runner-jest.config.js uses ESM syntax; Jest can't require()
// it. This CJS version overrides the stories transform to use a CJS wrapper
// instead of the ESM-only playwright/transform.js.
const { getJestConfig } = require('@storybook/test-runner')
const path = require('path')

const testRunnerConfig = getJestConfig()

module.exports = {
  ...testRunnerConfig,
  transform: {
    ...testRunnerConfig.transform,
    // Replace the ESM transform.js with a CJS-compatible wrapper
    '^.+\\.(story|stories)\\.[jt]sx?$': path.resolve(__dirname, '.storybook/test-runner-transform.js'),
  },
}
