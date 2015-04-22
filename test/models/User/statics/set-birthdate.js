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

  module.exports = function test__models__User__statics__setBirthdate (done) {
    var user;

    var dob = new Date('1981/01/15');

    var results;

    di(done, deps, function (domain, Test, User, Country, mongoUp) {

      var mongo = mongoUp();

      function test__models__User__statics__setBirthdate____createUser (done) {

        User.disposable(domain.intercept(function (randomUser) {
          user = randomUser;

          done();
        }));

      }

      function test__models__User__statics__setBirthdate____setBirthdate (done) {

        User.setBirthdate(user._id, dob, domain.intercept(function (user) {
          results = user;
          done();
        }));

      }

      function test__models__User__statics__setBirthdate____verifyBirthdate (done) {

        User
          .findById(user._id)
          .exec(domain.intercept(function (user) {
            user.should.have.property('dob').which.is.a.Date;
            user.dob.toString().should.be.exactly(dob.toString());
            done();
          }));

      }

      function test__models__User__statics__setBirthdate____cleanOut (done) {
        user.remove(domain.intercept(function () {
          mongo.disconnect(done);  
        }));
      }

      Test([

          test__models__User__statics__setBirthdate____createUser,
          test__models__User__statics__setBirthdate____setBirthdate,
          test__models__User__statics__setBirthdate____verifyBirthdate,
          test__models__User__statics__setBirthdate____cleanOut

        ], done);

    });
    
  };

} ();
