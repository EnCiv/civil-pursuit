! function () {
  
  'use strict';

  var encrypt = require('syn/models/User/statics/encrypt-password');

  var di = require('syn/lib/util/di/domain');

  var deps = ['syn/lib/util/encrypt'];

  function resetPassword (key, token, password, cb) {

    var self = this;

    di(cb, deps, function (domain, encrypt) {
      encrypt(password, domain.intercept(function (hash) {
        self
          
          .update(
            
            { activation_key: key, activation_token: token },

            { password: hash }
          
          )

          .exec(domain.intercept(function (number) {
            if ( ! number ) {
              throw new Error('No such key/token');
            }

            cb();
          }));
      }));
    });
  }

  module.exports = resetPassword;

} ();
