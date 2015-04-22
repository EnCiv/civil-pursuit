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

  module.exports = function test__models__User__statics__setParty (done) {
    var user, party, results;

    di(done, deps, function (domain, Test, User, Config, mongoUp) {

      var mongo = mongoUp();

      function test__models__User__statics__setParty____createUser (done) {

        User.disposable(domain.intercept(function (randomUser) {
          user = randomUser;

          done();
        }));

      }

      function test__models__User__statics__setParty____getRandomMaritalStatus (done) {

        Config.findOne(domain.intercept(function (randomParty) {
          party = randomParty;

          done();
        }));

      }
      function test__models__User__statics__setParty____setParty (done) {

        User.setParty(user._id, party._id, domain.intercept(function (user) {
          user.should.be.an.Object;
          user.should.have.property('party');
          user.party.constructor.name.should.be.exactly('ObjectID');
          user.party.should.be.exactly(party._id);
          done(); 
        }));

      }

      function test__models__User__statics__setParty____cleanOut (done) {
        user.remove(domain.intercept(function () {
          mongo.disconnect(done);  
        }));
      }

      Test([

          test__models__User__statics__setParty____createUser,
          test__models__User__statics__setParty____getRandomMaritalStatus,
          test__models__User__statics__setParty____setParty,
          test__models__User__statics__setParty____cleanOut

        ], done);

    });
    
  };

} ();
