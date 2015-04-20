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

  module.exports = function test__models__User__statics__resetPassword (done) {

    var user, keys, password = '72662h=dgWQwtwt52/';

    di(done, deps, function (domain, Test, User, mongoUp, randomString) {

      var mongo = mongoUp();

      function test__models__User__statics__resetPassword____createsDisposableUser (done) {
        
        User.disposable(domain.intercept(function (randomUser) {
          user = randomUser;
          done();
        }));

      }

      function test__models__User__statics__resetPassword____makePasswordResettable (done) {
        
        User.makePasswordResettable(user.email, domain.intercept(function (Keys) {
          keys = Keys;
          done();
        }));

      }

      function test__models__User__statics__resetPassword____resetPassword (done) {

        User.resetPassword(keys.key, keys.token, password, done);

      }

      function test__models__User__statics__resetPassword____passwordIsReset (done) {

        User.identify(user.email, password, done);

      }

      function disconnect (done) {
        user.remove(domain.intercept(function () {
          mongo.disconnect(done);  
        }));
      }

      Test([

          test__models__User__statics__resetPassword____createsDisposableUser,
          test__models__User__statics__resetPassword____makePasswordResettable,
          test__models__User__statics__resetPassword____resetPassword,
          test__models__User__statics__resetPassword____passwordIsReset,
          disconnect

        ], done);

    });
    
  };

} ();
