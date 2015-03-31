! function () {
  
  'use strict';

  var mongoose = require('mongoose');

  var schema = new mongoose.Schema({
    name        :   String,
    message     :   String,
    code        :   String,
    stack       :   String,
    debug       :   Object,
    repair      :   [mongoose.Schema.Types.Mixed]
  });

  schema.statics.throwError = function (error) {
    if ( error instanceof Error ) {
      this.create({
        name      : error.name,
        message   : error.message,
        code      : error.code,
        stack     : error.stack,
        debug     : error.debug,
        repair    : error.repair
      }, function () {});
    }
  };

  module.exports = mongoose.model('Error', schema);

} ();
