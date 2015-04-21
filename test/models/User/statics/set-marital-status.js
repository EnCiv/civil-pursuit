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

  module.exports = function test__models__User__statics__setMaritalStatus (done) {
    var user, married, results;

    di(done, deps, function (domain, Test, User, Config, mongoUp) {

      var mongo = mongoUp();

      function test__models__User__statics__setMaritalStatus____createUser (done) {

        User.disposable(domain.intercept(function (randomUser) {
          user = randomUser;

          done();
        }));

      }

      function test__models__User__statics__setMaritalStatus____getRandomMaritalStatus (done) {

        Config.findOne(domain.intercept(function (randomMaritalStatus) {
          married = randomMaritalStatus;

          done();
        }));

      }
      function test__models__User__statics__setMaritalStatus____setMaritalStatus (done) {

        User.setMaritalStatus(user._id, married._id, domain.intercept(function (user) {
          user.should.be.an.Object;
          user.should.have.property('married');
          user.married.constructor.name.should.be.exactly('ObjectID');
          user.married.should.be.exactly(married._id);
          done(); 
        }));

      }

      function test__models__User__statics__setMaritalStatus____cleanOut (done) {
        user.remove(domain.intercept(function () {
          mongo.disconnect(done);  
        }));
      }

      Test([

          test__models__User__statics__setMaritalStatus____createUser,
          test__models__User__statics__setMaritalStatus____getRandomMaritalStatus,
          test__models__User__statics__setMaritalStatus____setMaritalStatus,
          test__models__User__statics__setMaritalStatus____cleanOut

        ], done);

    });
    
  };

} ();
