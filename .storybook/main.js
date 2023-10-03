/** @type { import('@storybook/react-webpack5').StorybookConfig } */

import {merge} from 'webpack-merge'
const webpack=require("webpack");
const path = require("path");

const config = {
  stories: ['../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
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
  webpackFinal: async (config) => {

    const newConfig=merge(config,{
      module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                //include: /(.*profile.*)/, // for some reason, webpack (4.25.1) will exclude files with names containing 'profile' (or 'profile-' not sure) so I has to explicitly include them
                loader: "babel-loader",
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            }
        ]
    },
      resolve: {
        extensions: ['.*','.js','.jsx'],
        fallback: {
          "fs": false,
          "os": require.resolve("os-browserify/browser"),
          "http": require.resolve("stream-http"),
          "https": require.resolve("https-browserify"),
          "crypto": require.resolve("crypto-browserify"),
          "constants": require.resolve("constants-browserify"),
          "path": require.resolve("path-browserify"),
          "stream": require.resolve("stream-browserify"),


        }
      },
      plugins:[
        new webpack.IgnorePlugin({resourceRegExp: /clustered|dateFile|file|fileSync|gelf|hipchat|logFacesAppender|loggly|logstashUDP|mailgun|multiprocess|slack|smtp/},/(.*log4js.*)/),  // these appenders are require()ed by log4js but not used by this app
        new webpack.IgnorePlugin({resourceRegExp: /nodemailer/}), // not used in the client side - those should be move outside of the app directory
  
        // using a function because when this ran on heroku using just "../modules/client-side-model" failed
          new webpack.NormalModuleReplacementPlugin(/.+models\/.+/, resource => {
              resource.request = "../models/client-side-model";
          }),
  
          new webpack.HotModuleReplacementPlugin()  // DO NOT use --hot in the command line - it will cause a stack overflow on the client
      ]
    })
    return newConfig
  }
}
export default config
