! function () {
  
  'use strict';

  var bcrypt = require('bcrypt');

  var di = require('syn/lib/util/di/domain');

  function encrypt (str, cb) {

    di(cb, ['bcrypt'], function (domain, bcrypt) {

      bcrypt.genSalt(10, domain.intercept(function (salt) {
        bcrypt.hash(str, salt, domain.intercept(function (hash) {
          cb(null, hash);
        }));
      }));

    });

  }

  module.exports = encrypt;

} ();
