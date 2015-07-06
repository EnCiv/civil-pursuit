'use strict';

!(function () {

  'use strict';

  var async = require('async');

  function DI(deps, run, bindTo) {
    var inject = [];

    async.each(deps, function iterator(dep, cb) {
      inject.push(require(dep));
      cb();
    }, function done(error) {
      if (error) {
        throw error;
      }

      return run.apply(bindTo, inject);
    });
  }

  module.exports = DI;
})();