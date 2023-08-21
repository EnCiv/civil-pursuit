/** @type { import('@storybook/react-webpack5').StorybookConfig } */

import custom from './webpack.config.js';

const config = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },

  webpackFinal: async (config) => {
    return {
      ...config,
      module: { ...config.module, rules: [...config.module.rules, ...custom.module.rules] },

      resolve: {
        extensions: ['.*','.js','.jsx'],
        fallback: {
          "os": require.resolve("os-browserify/browser"),
          "http": require.resolve("stream-http"),
          "https": require.resolve("https-browserify"),
          "crypto": require.resolve("crypto-browserify"),
          "constants": require.resolve("constants-browserify"),
          "path": require.resolve("path-browserify"),
          "stream": require.resolve("stream-browserify"),


        }
      },
    };
  },
}
export default config
