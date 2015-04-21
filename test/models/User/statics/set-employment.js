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

  module.exports = function test__models__User__statics__setEmployment (done) {
    var user, employment, results;

    di(done, deps, function (domain, Test, User, Config, mongoUp) {

      var mongo = mongoUp();

      function test__models__User__statics__setEmployment____createUser (done) {

        User.disposable(domain.intercept(function (randomUser) {
          user = randomUser;

          done();
        }));

      }

      function test__models__User__statics__setEmployment____getRandomMaritalStatus (done) {

        Config.findOne(domain.intercept(function (randomMaritalStatus) {
          employment = randomMaritalStatus;

          done();
        }));

      }

      function test__models__User__statics__setEmployment____setEmployment (done) {

        User.setEmployment(user._id, employment._id, domain.intercept(function (user) {
          user.should.be.an.Object;
          user.should.have.property('employment');
          user.employment.constructor.name.should.be.exactly('ObjectID');
          user.employment.should.be.exactly(employment._id);
          done(); 
        }));

      }

      function test__models__User__statics__setEmployment____cleanOut (done) {
        user.remove(domain.intercept(function () {
          mongo.disconnect(done);  
        }));
      }

      Test([

          test__models__User__statics__setEmployment____createUser,
          test__models__User__statics__setEmployment____getRandomMaritalStatus,
          test__models__User__statics__setEmployment____setEmployment,
          test__models__User__statics__setEmployment____cleanOut

        ], done);

    });
    
  };

} ();
