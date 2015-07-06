'use strict';

!(function () {

  'use strict';

  var async = require('async');

  function Lib__Util__Domain(onError, deps, run) {

    if (typeof run !== 'function') {
      console.log('Oh the humanity' + JSON.stringify(deps));
    }

    var inject = [];

    async.each(deps, function iterator(dep, cb) {
      inject.push(require(dep));
      cb();
    }, function done(error) {
      if (error) {
        throw error;
      }

      var domain = require('domain').create();

      domain.on('error', function (error) {
        if (typeof onError === 'function') {
          onError(error);
        } else {
          throw error;
        }
      });

      domain.run(function () {
        process.nextTick(function () {
          run.apply(null, [domain].concat(inject));
        });
      });
    });
  }

  module.exports = Lib__Util__Domain;
})();