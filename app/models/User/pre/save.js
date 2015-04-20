! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/encrypt'
  ];

  function models__User__pre__save (next) {

    if ( ! this.isNew ) {
      return next();
    }

    this.email = this.email.toLowerCase();

    var self = this;

    di(next, deps, function (domain, encrypt) {

      encrypt(self.password, domain.intercept(function (hash) {
        self.password  = hash;
        next();
      }));

    });

  }

  module.exports = models__User__pre__save;

} ();
