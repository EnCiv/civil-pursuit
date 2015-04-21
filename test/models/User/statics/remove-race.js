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

  module.exports = function test__models__User__statics__removeRace (done) {
    var user, race, results;

    di(done, deps, function (domain, Test, User, Config, mongoUp) {

      var mongo = mongoUp();

      function test__models__User__statics__removeRace____createUser (done) {

        User.disposable(domain.intercept(function (randomUser) {
          user = randomUser;

          done();
        }));

      }

      function test__models__User__statics__removeRace____getRandomRace (done) {

        Config.findOne(domain.intercept(function (randomRace) {
          race = randomRace;

          done();
        }));

      }

      function test__models__User__statics__removeRace____addRace (done) {

        User.addRace(user._id, race._id, domain.intercept(function (user) {
          results = user;
          done();
        }));

      }

      function test__models__User__statics__removeRace____removeRace (done) {

        User.removeRace(user._id, race._id, domain.intercept(function (user) {
          user.should.be.an.Object;
          user.should.have.property('race').which.is.an.Array;
          user.race.length.should.be.exactly(0);
          done(); 
        }));

      }

      function test__models__User__statics__removeRace____cleanOut (done) {
        user.remove(domain.intercept(function () {
          mongo.disconnect(done);  
        }));
      }

      Test([

          test__models__User__statics__removeRace____createUser,
          test__models__User__statics__removeRace____getRandomRace,
          test__models__User__statics__removeRace____addRace,
          test__models__User__statics__removeRace____removeRace,
          test__models__User__statics__removeRace____cleanOut

        ], done);

    });
    
  };

} ();
