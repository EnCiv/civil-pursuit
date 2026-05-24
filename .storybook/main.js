import { merge } from 'webpack-merge'
import path from 'path'
import webpackDevConfig from '../webpack-dev.config'

const config = {
  stories: [
    '../stories/**/*.stories.@(js|jsx|ts|tsx)', // Correct path to the stories folder
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/addon-a11y', '@storybook/addon-viewport', '@storybook/addon-webpack5-compiler-babel'],
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
    }
    return newConfig
  },
}
export default config
