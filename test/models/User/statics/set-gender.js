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

  module.exports = function test__models__User__statics__setGender (done) {
    var user;

    var results;

    var genders = ['M', 'F'];

    var gender = genders[(+(Math.random().toString().substr(3,1)) % 2)];

    di(done, deps, function (domain, Test, User, Country, mongoUp) {

      var mongo = mongoUp();

      function test__models__User__statics__setGender____createUser (done) {

        User.disposable(domain.intercept(function (randomUser) {
          user = randomUser;

          done();
        }));

      }

      function test__models__User__statics__setGender____setGender (done) {

        User.setGender(user._id, gender, domain.intercept(function (user) {
          results = user;
          done();
        }));

      }

      function test__models__User__statics__setGender____verifyGender (done) {

        User
          .findById(user._id)
          .exec(domain.intercept(function (user) {
            user.should.have.property('gender').which.is.a.String;
            user.gender.should.be.exactly(gender);
            done();
          }));

      }

      function test__models__User__statics__setGender____cleanOut (done) {
        user.remove(domain.intercept(function () {
          mongo.disconnect(done);  
        }));
      }

      Test([

          test__models__User__statics__setGender____createUser,
          test__models__User__statics__setGender____setGender,
          test__models__User__statics__setGender____verifyGender,
          test__models__User__statics__setGender____cleanOut

        ], done);

    });
    
  };

} ();
