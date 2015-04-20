! function () {
  
  'use strict';

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

      self.constructor.encryptPassword(self.password, domain.intercept(function (hash) {
        self.password  = hash;
        next();
      }));

    });
  }

  module.exports = preSave;

} ();
