// CJS wrapper for @storybook/test-runner's ESM transform.
// The original playwright/transform.js uses ESM syntax which Jest can't require()
// directly. This wrapper exposes the same processAsync logic via CJS module.exports.
const { transformPlaywright } = require('@storybook/test-runner')
const swc = require('@swc/core')

module.exports = {
  async processAsync(src, filename) {
    try {
      const csfTest = await transformPlaywright(src, filename)
      const result = await swc.transform(csfTest, {
        filename,
        isModule: true,
        module: { type: 'es6' },
        jsc: {
          parser: { syntax: 'ecmascript', jsx: true },
          target: 'es2015',
        },
      })
      return { code: result ? result.code : csfTest }
    } catch (error) {
      console.error('Transform error:', error)
      return { code: src }
    }
  },
}
