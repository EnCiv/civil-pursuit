! function () {
  
  'use strict';

  var bcrypt = require('bcrypt');

  function Models__User__Statics__isPasswordValid (requestPassword, realPassword, cb) {
    bcrypt.compare(requestPassword, realPassword, cb);
  }

  module.exports = Models__User__Statics__isPasswordValid;

} ();
