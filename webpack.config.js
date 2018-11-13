const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
//const IgnorePlugin=require("ignore-plugin");
const webpack=require("webpack");

module.exports = {
    context: path.resolve(__dirname, "app"),
    entry: "./client/main.js",
    output: {
        path: path.join(__dirname, "assets/js"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                include: /(.*profile.*)/, // for some reason, webpack (4.25.1) will exclude files with names containing 'profile' (or 'profile-' not sure) so I has to explicitly include them
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    resolve: {
        extensions: ['*','.js','.jsx'],
    },
    node: {
        fs: 'empty' // logger wants to require fs though it's not needed on the browser
    },
    devServer: {
        port: 3011,
        open: true,
        proxy: {
            "/api": "http://localhost:3012"
        }
    },
    plugins:[
        new webpack.IgnorePlugin(/categoryFilter|clustered|dateFile|file|fileSync|gelf|hipchat|logFacesAppender|logLevelFilter|loggly|logstashUDP|mailgun|multiprocess|slack|smtp/,/(.*log4js.*)/),  // these appenders are require()ed by log4js but not used by this app
        new webpack.IgnorePlugin(/nodemailer/), // not used in the client side - those should be move outside of the app directory
    ]
};