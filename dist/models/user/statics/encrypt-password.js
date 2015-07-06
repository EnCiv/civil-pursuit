'use strict';

!(function () {

  'use strict';

  var bcrypt = require('bcrypt');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function encryptPassword(password, cb) {
    var domain = require('domain').create();

    domain.on('error', function (error) {
      cb(error);
    });

    domain.run(function () {
      bcrypt.genSalt(10, domain.intercept(function (salt) {
        bcrypt.hash(password, salt, domain.intercept(function (hash) {
          cb(null, hash);
        }));
      }));
    });
  }

  module.exports = encryptPassword;
})();