const path = require("path");
const webpack=require("webpack");

const use= [
    {   loader: "babel-loader",
    }
]


module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, "app"),
    entry: {
        main:    "./client/main.js",
        // item:    "./vtest/item.jsx" // split chunks can't be disable if there is more than one entry point
    },
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, "assets/webpack"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                include: name=>{console.info(name);if(name.includes('profile'))return true; else return false}, // for some reason, webpack (4.25.1) will exclude files with names containing 'profile' (or 'profile-' not sure) so I has to explicitly include them
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
            }
        ]
    },
    resolve: {
        extensions: ['.*','.js','.jsx'],
        fallback: {
            fs: false,
            "path": require.resolve("path-browserify")
        }
    },
    node: false,
    plugins:[
        new webpack.IgnorePlugin({resourceRegExp: /clustered|dateFile|file|fileSync|gelf|hipchat|logFacesAppender|loggly|logstashUDP|mailgun|multiprocess|slack|smtp/},/(.*log4js.*)/),  // these appenders are require()ed by log4js but not used by this app
        new webpack.IgnorePlugin({resourceRegExp: /nodemailer/}), // not used in the client side - those should be move outside of the app directory
  
        // using a function because when this ran on heroku using just "../modules/client-side-model" failed
          new webpack.NormalModuleReplacementPlugin(/.+models\/.+/, resource => {
              resource.request = "../models/client-side-model";
          }),
    ],
};