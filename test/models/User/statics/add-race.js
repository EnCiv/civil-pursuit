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

  module.exports = function test__models__User__statics__addRace (done) {
    var user, race, results;

    di(done, deps, function (domain, Test, User, Config, mongoUp) {

      var mongo = mongoUp();

      function test__models__User__statics__addRace____createUser (done) {

        User.disposable(domain.intercept(function (randomUser) {
          user = randomUser;

          done();
        }));

      }

      function test__models__User__statics__addRace____getRandomRace (done) {

        Config.findOneRandom(domain.intercept(function (randomRace) {
          race = randomRace;

          done();
        }));

      }

      function test__models__User__statics__addRace____addRace (done) {

        User.addRace(user._id, race._id, domain.intercept(function (user) {
          results = user;
          done();
        }));

      }

      function test__models__User__statics__addRace____raceIsAdded (done) {

        results.should.have.property('race')
          .which.is.an.Array;

        results.race[0].should.be.exactly(race._id);

        done();

      }

      function test__models__User__statics__addRace____cleanOut (done) {
        user.remove(domain.intercept(function () {
          mongo.disconnect(done);  
        }));
      }

      Test([

          test__models__User__statics__addRace____createUser,
          test__models__User__statics__addRace____getRandomRace,
          test__models__User__statics__addRace____addRace,
          test__models__User__statics__addRace____raceIsAdded,
          test__models__User__statics__addRace____cleanOut

        ], done);

    });
    
  };

} ();
