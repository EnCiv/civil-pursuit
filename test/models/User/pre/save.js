! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'syn/models/User',
    'syn/lib/util/connect-to-mongoose',
    'syn/lib/util/random-string',
    'should'
  ];

  function Test__Models__User__Pre__Save (done) {
    
    di(done, deps, function (domain, Test, User, mongoUp, randomString) {

      var fn, user, email, password;

      randomString(10, domain.intercept(function (rand) {
        
        email = 'TEST' + rand + '@GMAIL.COM';

      }));

      randomString(25, domain.intercept(function (rand) {
        
        password = rand;

      }));

      function Models__User__Pre__Save____Exists (done) {
        fn = require('syn/models/User/pre/save');
        done();
      }

      function Models__User__Pre__Save____Is_A_Function (done) {
        fn.should.be.a.Function;
        done();
      }

      function Models__User__Create (done) {
        mongoUp();

        User

          .create({
            email     :     email,
            password  :     password
          },

          function (error, newUser) {
            if ( error ) {
              return done(error);
            }

            user = newUser;

            done();
          });
      }

      Test([

          Models__User__Pre__Save____Exists,
          Models__User__Pre__Save____Is_A_Function,
          Models__User__Create

        ], done);

    });

  }

  module.exports = Test__Models__User__Pre__Save;

} ();
