! function () {
  
  'use strict';

  var bcrypt = require('bcrypt');

  function models__User__statics__isPasswordValid (requestPassword, realPassword, cb) {
    bcrypt.compare(requestPassword, realPassword, cb);
  }

  module.exports = models__User__statics__isPasswordValid;

} ();
