import { merge } from 'webpack-merge'
const webpack = require('webpack')

const config = {
  stories: [
    '../stories/**/*.stories.@(js|jsx|ts|tsx)', // Correct path to the stories folder
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async config => {
    const newConfig = merge(config, {
      module: {
        rules: [
          {
            test: /\.jsx$/,
            exclude: /node_modules/,
            //include: /(.*profile.*)/, // for some reason, webpack will exclude files with names containing 'profile' (or 'profile-' not sure) so I has to explicitly include them
            loader: 'babel-loader',
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
          },
        ],
      },
      resolve: {
        extensions: ['.js', '.jsx'],
        fallback: {
          fs: false,
          os: require.resolve('os-browserify/browser'),
          http: require.resolve('stream-http'),
          https: require.resolve('https-browserify'),
          crypto: require.resolve('crypto-browserify'),
          constants: require.resolve('constants-browserify'),
          path: require.resolve('path-browserify'),
          stream: require.resolve('stream-browserify'),
        },
      },
      plugins: [
        new webpack.IgnorePlugin({
          resourceRegExp:
            /clustered|dateFile|file|fileSync|gelf|hipchat|logFacesAppender|loggly|logstashUDP|mailgun|multiprocess|slack|smtp/,
          contextRegExp: /(.*log4js.*)/, // these appenders are require()ed by log4js but not used by this app
        }),
        new webpack.IgnorePlugin({
          resourceRegExp: /nodemailer/,
        }), // not used in the client side - those should be moved outside of the app directory
        new webpack.NormalModuleReplacementPlugin(/.+models\/.+/, resource => {
          resource.request = '../models/client-side-model'
        }),
        new webpack.HotModuleReplacementPlugin(),
      ],
    })
    return newConfig
  },
}
export default config
