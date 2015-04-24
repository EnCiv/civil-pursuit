! function () {
  
  'use strict';

  var Promise = require('promise');

  function node (cb) {
    cb(new Error('foo'));
  }

  Function.promisify = function (node) {
    return {
      fn      :   node,
      when    :   function () {
        var self = this;

        var args  = [];

        for ( var i in arguments ) {
          args.push(arguments[i]);
        }

        self.promise = new Promise(function (fulfill, reject) {

          process.nextTick(function () {
          
            var domain = require('domain').create();
            
            domain
              
              .on('error', reject)
            
              .run(function () {

                var cb = args.pop();

                args.push(function promisify () {


                  var args = [];

                  for ( var i in arguments ) {
                    args.push(arguments[i]);
                  }

                  if ( arguments[0] ) {
                    return reject(arguments[0]);
                  }

                  // cb.apply(null, args);

                  fulfill.apply(null, args);

                });

                self.fn.apply(null, args);
              });

          });

        });

        var w = {
          then    :   function (success, error) {
            self.promise.then(success, error);
            return w;
          },

          catch   :   function (error) {
            self.promise.then(null, error);
          }
        };

        return w;

      }
    };
  };

  x()

  function x () {

    function foo () {
      console.log('[[[ FOO ]]]', arguments);
    }

    node(foo);

    Function
      .promisify(node)
      .when(foo)
      .then(function () {
        console.log('[[[ OK ]]]', arguments)
      })
      .catch(function () {
        console.log('[[[ KO ]]]', arguments)
      });

  }


} ();
