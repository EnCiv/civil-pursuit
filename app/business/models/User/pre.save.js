! function () {
  
  'use strict';

  var bcrypt      =   require('bcrypt');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function preSave (next) {
    if ( ! this.isNew ) {
      return next();
    }

    this.email = this.email.toLowerCase();

    var self = this;

    var domain = require('domain').create();

    domain.on('error', function (error) {
      next(error);
    });

    domain.run(function () {
      bcrypt.genSalt(10, domain.intercept(function (salt) {
        bcrypt.hash(self.password, salt, domain.intercept(function (hash) {
          self.password  = hash;
          next();
        }));
      }));
    });
  }

  module.exports = preSave;

} ();
