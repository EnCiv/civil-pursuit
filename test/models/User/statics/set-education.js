! function () {
  
  'use strict';

  var should = require('should');

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'syn/models/User',
    'syn/models/Config',
    'syn/lib/util/connect-to-mongoose',
    'should'
  ];

  module.exports = function test__models__User__statics__setEducation (done) {
    var user, education, results;

    di(done, deps, function (domain, Test, User, Config, mongoUp) {

      var mongo = mongoUp();

      function test__models__User__statics__setEducation____createUser (done) {

        User.disposable(domain.intercept(function (randomUser) {
          user = randomUser;

          done();
        }));

      }

      function test__models__User__statics__setEducation____getRandomMaritalStatus (done) {

        Config.findOne(domain.intercept(function (randomMaritalStatus) {
          education = randomMaritalStatus;

          done();
        }));

      }

      function test__models__User__statics__setEducation____setEducation (done) {

        User.setEducation(user._id, education._id, domain.intercept(function (user) {
          user.should.be.an.Object;
          user.should.have.property('education');
          user.education.constructor.name.should.be.exactly('ObjectID');
          user.education.should.be.exactly(education._id);
          done(); 
        }));

      }

      function test__models__User__statics__setEducation____cleanOut (done) {
        user.remove(domain.intercept(function () {
          mongo.disconnect(done);  
        }));
      }

      Test([

          test__models__User__statics__setEducation____createUser,
          test__models__User__statics__setEducation____getRandomMaritalStatus,
          test__models__User__statics__setEducation____setEducation,
          test__models__User__statics__setEducation____cleanOut

        ], done);

    });
    
  };

} ();
