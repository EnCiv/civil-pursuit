! function () {
  
  'use strict';

  var encrypt = require('./encrypt-password');

  /** Reset password
   *
   *  @method User.statics.resetPassword
   *  @return null
   *  @arg {string} key
   *  @arg {string} token
   *  @arg {string} password - in clear
   *  @arg {function} cb
   *  @example User.resetPassword(String, String, String, Function);
   */

  function resetPassword (key, token, password, cb) {

    var self = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      cb(error);
    });
    
    domain.run(function () {

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
