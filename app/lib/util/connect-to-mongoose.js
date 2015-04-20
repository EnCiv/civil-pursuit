! function () {
  
  'use strict';

  var mongoose = require('mongoose');

  function Lib__Util__ConnectToMongoose () {
    mongoose.connect(process.env.MONGOHQ_URL);

    return mongoose;
  }

  module.exports = Lib__Util__ConnectToMongoose;

} ();
