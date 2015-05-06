! function () {
  
  'use strict';

  var mongoose = require('mongoose');

  function Lib__Util__ConnectToMongoose (cb) {

    if ( mongoose.connection && mongoose.connection._listening ) {
      return mongoose;
    }

    mongoose.connect(process.env.MONGOHQ_URL);

    mongoose.connection.on('error', function (error) {
      throw error;
    });

    mongoose.connection.on('connected', function () {
    });

    return mongoose;
  }

  module.exports = Lib__Util__ConnectToMongoose;

} ();
