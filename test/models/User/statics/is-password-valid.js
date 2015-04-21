! function () {
  
  'use strict';

  var should = require('should');

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'syn/models/User',
    'syn/lib/util/connect-to-mongoose',
    'syn/lib/util/random-string',
    'should'
  ];

  module.exports = function test__models__User__statics__isPasswordValid (done) {

    var email;
    var password;
    var user;

    di(done, deps, function (domain, Test, User, mongoUp, randomString) {

      var mongo = mongoUp();

      function test__models__User__statics__isPasswordValid____createUser (done) {

        User.create({ email: email, password: password },
          domain.intercept(function (randomUser) {
            user = randomUser;

            done();
          }));

      }

      function test__models__User__statics__isPasswordValid____verifyPassword (done) {

        User.isPasswordValid(password, user.password, domain.intercept(function (isValid) {
          isValid.should.be.true;
          done();
        }));

      }

      function disconnect (done) {
        user.remove(domain.intercept(function () {
          mongo.disconnect(done);  
        }));
      }

      randomString(25, domain.intercept(function (random) {
        
        email     =   random.toLowerCase() + '@test.synapp.com';
        password  =   random;

        Test([

            test__models__User__statics__isPasswordValid____createUser,
            test__models__User__statics__isPasswordValid____verifyPassword,
            disconnect

          ], done);

      }))

    });
    
  };

} ();
