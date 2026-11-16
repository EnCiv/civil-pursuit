const { merge } = require('webpack-merge')
const path = require('path')
const webpackDevConfig = require('../webpack.config')

const config = {
  stories: [
    '../stories/**/*.stories.@(js|jsx|ts|tsx)', // Correct path to the stories folder
  ],
  // In Storybook 10, actions/interactions/viewport/essentials are built into the framework.
  // Only truly separate addons need to be listed here.
  addons: ['@storybook/addon-links', '@storybook/addon-a11y', '@storybook/addon-webpack5-compiler-babel'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {},
  webpackFinal: async config => {
    const storyDevConfig = { ...webpackDevConfig, entry: undefined, output: undefined } // to be set by storybook
    storyDevConfig.module.rules = storyDevConfig.module.rules.filter(rule => rule.use !== 'css-loader') // there is already a css loader rule in storybook and the on in dev cause a problem here
    const newConfig = merge(config, storyDevConfig)
    // Ensure civil-client (and other peer-dep packages) resolve react/react-dom
    // from civil-pursuit's own node_modules, not their own missing copies.
    newConfig.resolve = newConfig.resolve || {}
    newConfig.resolve.alias = {
      ...newConfig.resolve.alias,
      react: path.resolve('node_modules/react'),
      'react-dom': path.resolve('node_modules/react-dom'),
      // CRITICAL: Ensure all chunks use the same superagent instance so preview.js mock works
      superagent: path.resolve('node_modules/superagent'),
    }
    // Storybook's DefinePlugin replaces `process.env` with a literal object everywhere,
    // including on the LEFT-HAND SIDE of assignments like `if (!process.env) process.env = {}`.
    // That produces `({"NODE_ENV":...}) = {}` which is a SyntaxError.
    // Remove the process.env definition so process.env stays as-is and the guard works correctly.
    for (const plugin of newConfig.plugins) {
      if (plugin.definitions && plugin.definitions['process.env']) {
        delete plugin.definitions['process.env']
      }
    }
    return newConfig
  },
}
module.exports = config
