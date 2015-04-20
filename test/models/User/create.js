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

  function test__models__User__create (done) {
    
    di(done, deps, function (domain, async, Test, User, mongoUp, randomString) {

      var mongo = mongoUp();

      var user, email, password;

      function test__models__User__create____Create (done) {
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

      function test__models__User__create____emailIsLowerCase (done) {
        user.email.should.be.exactly(email.toLowerCase());
        done();
      }

      function test__models__User__create____passwordIsEncrypted (done) {
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

            test__models__User__create____Create,
            test__models__User__create____emailIsLowerCase,
            test__models__User__create____passwordIsEncrypted,
            disconnect

          ], done);  
      }));

    });

  }

  module.exports = test__models__User__create;

} ();
