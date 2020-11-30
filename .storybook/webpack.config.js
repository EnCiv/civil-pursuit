const path = require("path");
const webpack=require("webpack");

// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

module.exports = {
  plugins:[
    new webpack.IgnorePlugin(/clustered|dateFile|file|fileSync|gelf|hipchat|logFacesAppender|loggly|logstashUDP|mailgun|multiprocess|slack|smtp/,/(.*log4js.*)/),  // these appenders are require()ed by log4js but not used by this app
    new webpack.IgnorePlugin(/nodemailer/), // not used in the client side - those should be move outside of the app directory
    new webpack.NormalModuleReplacementPlugin(/.+models\/.+/,'../models/client-side-model'), // do not include models on the client side - the app/api files contain server side and client side code
  ],
  module: {
    rules: [
      // add your custom rules.
    ],
  },
  externals: {
    'jsdom': 'window',
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window',
    'react/addons': true,
  }
};
