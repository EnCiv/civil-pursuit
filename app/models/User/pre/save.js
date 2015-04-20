! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [];

  function Models__User__Pre__Save (next) {

    if ( ! this.isNew ) {
      return next();
    }

    this.email = this.email.toLowerCase();

    var self = this;

    di(next, deps, function (domain) {

      self.constructor.encryptPassword(self.password, domain.intercept(function (hash) {
        self.password  = hash;
        next();
      }));

    });

  }

  module.exports = Models__User__Pre__Save;

} ();
