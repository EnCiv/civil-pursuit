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

  module.exports = function test__models__User__statics__setCitizenship (done) {
    var user, countries, results = [], limit = 3;

    di(done, deps, function (domain, Test, User, Country, mongoUp) {

      var mongo = mongoUp();

      function test__models__User__statics__setCitizenship____createUser (done) {

        User.disposable(domain.intercept(function (randomUser) {
          user = randomUser;

          done();
        }));

      }

      function test__models__User__statics__setCitizenship____getRandomCountries (done) {

        Country
          .findRandom({}, {limit: limit}, domain.intercept(function (randomCountries) {
            countries = randomCountries;

            done();
        }));

      }

      function test__models__User__statics__setCitizenship____setCitizenship_1 (done) {

        User.setCitizenship(user._id, countries[0]._id, limit - 1, domain.intercept(function (user) {
          results.push(user);
          done();
        }));

      }

      function test__models__User__statics__setCitizenship____citizenshipIsAdded_1 (done) {

        results[0].should.have.property('citizenship')
          .which.is.an.Array;

        results[0].citizenship[limit - 1].should.be.exactly(countries[0]._id);

        done();

      }

      function test__models__User__statics__setCitizenship____cleanOut (done) {
        user.remove(domain.intercept(function () {
          mongo.disconnect(done);  
        }));
      }

      Test([

          test__models__User__statics__setCitizenship____createUser,
          test__models__User__statics__setCitizenship____getRandomCountries,
          test__models__User__statics__setCitizenship____setCitizenship_1,
          test__models__User__statics__setCitizenship____citizenshipIsAdded_1,
          test__models__User__statics__setCitizenship____cleanOut

        ], done);

    });
    
  };

} ();
