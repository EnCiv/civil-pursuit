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

  module.exports = function test__models__User__statics__makePasswordResettable (done) {

    var email, password, user, keys;

    di(done, deps, function (domain, Test, User, mongoUp, randomString) {

      var mongo = mongoUp();

      function test__models__User__statics__makePasswordResettable____createsDisposableUser (done) {

        User.disposable(domain.intercept(function (randomUser) {
          user = randomUser;
          done();
        }));

      }

      function test__models__User__statics__makePasswordResettable____resetsPassword (done) {
        
        User.makePasswordResettable(user.email,
          domain.intercept(function (Keys) {
            keys = Keys;
            keys.should.be.an.Object;
            done();
          }));

      }

      function test__models__User__statics__makePasswordResettable____verifyInBackEnd (done) {

        User.findById(user._id)
          .exec(domain.intercept(function (sameUser) {
            sameUser.activation_key.should.be.exactly(keys.key);
            sameUser.activation_token.should.be.exactly(keys.token);
            done();
          }));

      }

      function disconnect (done) {
        user.remove(domain.intercept(function () {
          mongo.disconnect(done);  
        }));
      }

      Test([

          test__models__User__statics__makePasswordResettable____createsDisposableUser,
          test__models__User__statics__makePasswordResettable____resetsPassword,
          test__models__User__statics__makePasswordResettable____verifyInBackEnd,
          disconnect

        ], done);

    });
    
  };

} ();
