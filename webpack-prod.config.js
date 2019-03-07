const path = require("path");
const webpack=require("webpack");

const use= [
    {   loader: "babel-loader",
    }
]


module.exports = {
    mode: 'production',
    context: path.resolve(__dirname, "app"),
    entry: {
    main:    "./client/main.js",
    item:    "./vtest/item.jsx"
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
            }
        ]
    },
    resolve: {
        extensions: ['*','.js','.jsx'],
    },
    node: {
        fs: 'empty' // logger wants to require fs though it's not needed on the browser
    },
    plugins:[
        new webpack.IgnorePlugin(/categoryFilter|clustered|dateFile|file|fileSync|gelf|hipchat|logFacesAppender|logLevelFilter|loggly|logstashUDP|mailgun|multiprocess|slack|smtp/,/(.*log4js.*)/),  // these appenders are require()ed by log4js but not used by this app
        new webpack.NormalModuleReplacementPlugin(/.+models\/.+/,'../models/client-side-model'), // do not include models on the client side - the app/api files contain server side and client side code
        new webpack.IgnorePlugin(/nodemailer/), // not used in the client side - those should be move outside of the app directory
    ]
};