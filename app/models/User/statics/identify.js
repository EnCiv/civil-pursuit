! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function identify (email, password, cb) {
    var self = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      cb(error);
    });
    
    domain.run(function () {

      self.findOne({ email: email }, domain.intercept(function (user) {
        if ( ! user ) {
          throw new Error('User not found ' + email);
        }
        
        self.isPasswordValid(password, user.password, domain.intercept(function (isValid) {
          if ( ! isValid ) {
            throw new Error('Wrong password');
          }
          
          cb(null, user);
        }));
      }));

    });
  }

  module.exports = identify;

} ();
