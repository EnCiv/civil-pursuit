! function () {
  
  'use strict';

  var domain          =   require('domain');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function domainRun (fn, reject) {
    var d = domain.create();

    d.intercept = function (fn, _self) {

      if ( typeof fn !== 'function' ) {
        fn = function () {};
      }

      return function (error) {
        if ( error && error instanceof Error ) {
          self.domain.emit('error', error);
        }

        else {
          var args = Array.prototype.slice.call(arguments);

          args.shift();

          fn.apply(_self, args);
        }
      };
    };

    d.on('error', function onDomainError (error) {
      console.error(error);

      if ( error.stack ) {
        error.stack.split(/\n/).forEach(function (line) {
          line.split(/\n/).forEach(console.warn.bind(console));
        });
      }

      if ( typeof reject === 'function' ) {
        reject(error);
      }
    });

    d.run(function () {
      fn(d);
    });
  }

  module.exports = domainRun;

} ();
