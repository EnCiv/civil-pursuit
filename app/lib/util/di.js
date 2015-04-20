! function () {
  
  'use strict';

  var async = require('async');

  function Lib__Util__Di (deps, run) {
    var inject = [];

    async.each(deps,
      function iterator (dep, cb) {
        inject.push(require(dep));
        cb();
      },
      function done (error) {
        if ( error ) {
          throw error;
        }

        run.apply(null, inject);
      });
  }

  module.exports = Lib__Util__Di;

} ();
