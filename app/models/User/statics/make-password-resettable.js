! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = ['async', 'syn/lib/util/random-string'];

  function makePasswordResettable (email, cb) {

    var self = this;

    di(cb, deps, function (domain, async, randomString) {

      async.parallel({
        key   :   function (done) {
          randomString(8, done);
        },

        token :   function (done) {
          randomString(8, done);
        }
      },

        domain.intercept(function (results) {
        
          self.update(
            
            { email: email },

            {
              activation_key    :   results.key,
              activation_token  :   results.token
            })

            .exec(domain.intercept(function (number) {
              if ( ! number ) {
                var error = new Error('No such email');

                error.code = 'DOCUMENT_NOT_FOUND';

                throw error;
              }

              cb(null, { key: key, token: token });
            }));
        
        }));

    });
  }

  module.exports = makePasswordResettable;

} ();
