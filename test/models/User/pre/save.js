! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'async',
    'syn/lib/Test',
    'syn/models/User',
    'syn/lib/util/connect-to-mongoose',
    'syn/lib/util/random-string',
    'should'
  ];

  function test__models__User__pre__save (done) {
    
    di(done, deps, function (domain, async, Test, User, mongoUp, randomString) {

      var mongo = mongoUp();

      var fn, user, email, password;

      function test__models__User__pre__save____Exists (done) {
        fn = require('syn/models/User/pre/save');
        done();
      }

      function test__models__User__pre__save____Is_A_Function (done) {
        fn.should.be.a.Function;
        done();
      }

      function test__models__User__pre__save____Create (done) {
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

      function test__models__User__pre__save____emailIsLowerCase (done) {
        user.email.should.be.exactly(email.toLowerCase());
        done();
      }

      function test__models__User__pre__save____passwordIsEncrypted (done) {
        user.password.should.not.be.exactly(password);
        done();
      }

      function disconnect (done) {
        user.remove(domain.intercept(function () {
          mongo.disconnect(done);  
        }));
      }

      var parallels = [

        function generateRandomEmail (done) {
          randomString(10, domain.intercept(function (rand) {
            
            email = 'TEST' + rand + '@GMAIL.COM';

            done();

          }));
        },

        function generateRandomPassword (done) {
          randomString(25, domain.intercept(function (rand) {
            
            password = rand;

            done();

          }));
        }

      ];

      async.parallel(parallels, domain.intercept(function () {
        Test([

            test__models__User__pre__save____Exists,
            test__models__User__pre__save____Is_A_Function,
            test__models__User__pre__save____Create,
            test__models__User__pre__save____emailIsLowerCase,
            test__models__User__pre__save____passwordIsEncrypted,
            disconnect

          ], done);  
      }));

    });

  }

  module.exports = test__models__User__pre__save;

} ();
