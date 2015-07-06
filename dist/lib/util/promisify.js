'use strict';

!(function () {

  'use strict';

  var Promise = require('promise');

  Function.promisify = function (node, binder) {
    return {
      fn: node,
      when: function when() {
        var self = this;

        var args = [];

        for (var i in arguments) {
          args.push(arguments[i]);
        }

        self.promise = new Promise(function (fulfill, reject) {

          process.nextTick(function () {

            var domain = require('domain').create();

            domain.on('error', reject).run(function () {

              args.push(function promisify() {

                var args = [];

                for (var i in arguments) {
                  if (+i) {
                    args.push(arguments[i]);
                  }
                }

                if (arguments[0]) {
                  return reject(arguments[0]);
                }

                // cb.apply(null, args);

                fulfill.apply(binder, args);
              });

              self.fn.apply(binder, args);
            });
          });
        });

        var w = {
          then: function then(success, error) {
            self.promise.then(success, error);
            return w;
          },

          'catch': function _catch(error) {
            self.promise.then(null, error);
          }
        };

        return w;
      }
    };
  };
})();