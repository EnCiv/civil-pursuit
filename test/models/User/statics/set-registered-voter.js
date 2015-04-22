! function () {
  
  'use strict';

  var should = require('should');

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'syn/models/User',
    'syn/models/Country',
    'syn/lib/util/connect-to-mongoose',
    'should'
  ];

  module.exports = function test__models__User__statics__setRegisteredVoter (done) {
    var user;

    var results;

    var isRegisteredVoter = [true, false][(+(Math.random().toString().substr(3,1)) % 2)];

    di(done, deps, function (domain, Test, User, Country, mongoUp) {

      var mongo = mongoUp();

      function test__models__User__statics__setRegisteredVoter____createUser (done) {

        User.disposable(domain.intercept(function (randomUser) {
          user = randomUser;

          done();
        }));

      }

      function test__models__User__statics__setRegisteredVoter____setRegisteredVoter (done) {

        User.setRegisteredVoter(user._id, isRegisteredVoter, domain.intercept(function (user) {
          results = user;
          done();
        }));

      }

      function test__models__User__statics__setRegisteredVoter____verifyRegisteredVoter (done) {

        User
          .findById(user._id)
          .exec(domain.intercept(function (user) {
            user.should.have.property('registered_voter').which.is.a.Boolean;
            user['registered_voter'].should.be.exactly(isRegisteredVoter);
            done();
          }));

      }

      function test__models__User__statics__setRegisteredVoter____cleanOut (done) {
        user.remove(domain.intercept(function () {
          mongo.disconnect(done);  
        }));
      }

      Test([

          test__models__User__statics__setRegisteredVoter____createUser,
          test__models__User__statics__setRegisteredVoter____setRegisteredVoter,
          test__models__User__statics__setRegisteredVoter____verifyRegisteredVoter,
          test__models__User__statics__setRegisteredVoter____cleanOut

        ], done);

    });
    
  };

} ();
