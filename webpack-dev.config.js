const path = require('path')
const webpack = require('webpack')

const use = [{ loader: 'babel-loader' }]

const env = process.env.NODE_ENV || 'development'
if (env !== 'development') console.error('NODE_ENV is', env, "but needs to be 'development' when the server runs")

module.exports = {
  context: path.resolve(__dirname, 'app'),
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'only-dev-server': 'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    main: './client/main-app.js',
  },
  output: {
    path: path.join(__dirname, 'assets/webpack'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        include: /(.*profile.*)/, // for some reason, webpack (4.25.1) will exclude files with names containing 'profile' (or 'profile-' not sure) so I has to explicitly include them
        use,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use,
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use,
      },
    ],
  },
  resolve: {
    extensions: ['.*', '.js', '.jsx'],
    fallback: {
      fs: false,
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      os: require.resolve('os-browserify/browser'),
      zlib: require.resolve('browserify-zlib'),
      constants: require.resolve('constants-browserify'),
      buffer: require.resolve('buffer'),
      assert: require.resolve('assert/'),
    },
  },
  node: false,
  devServer: {
    static: {
      publicPath: '/assets/webpack/', // in main.js also ass if(typeof ___webpack_public_path__ !== 'undefined' __webpack_public_path__ = "http://localhost:3011/assets/webpack/";  // this is where the hot loader sends requests to
    },
    host: '0.0.0.0',
    port: 3011,
    devMiddleware: {
      index: false, // specify to enable root proxying
    },
    proxy: {
      // the dev server will proxy all traffic other than publicPath to target below.
      context: () => true,
      target: 'http://localhost:3012', // this is where the node server of the application is really running
    },
  },
  plugins: [
    new webpack.IgnorePlugin(
      {
        resourceRegExp:
          /clustered|dateFile|file|fileSync|gelf|hipchat|logFacesAppender|loggly|logstashUDP|mailgun|multiprocess|slack|smtp/,
      },
      /(.*log4js.*)/
    ), // these appenders are require()ed by log4js but not used by this app
    new webpack.IgnorePlugin({ resourceRegExp: /nodemailer/ }), // not used in the client side - those should be move outside of the app directory

    // using a function because when this ran on heroku using just "../modules/client-side-model" failed
    new webpack.NormalModuleReplacementPlugin(/.+models\/.+/, resource => {
      resource.request = '../models/client-side-model'
    }),

    new webpack.HotModuleReplacementPlugin(), // DO NOT use --hot in the command line - it will cause a stack overflow on the client

    // Work around for Buffer is undefined:
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
}
