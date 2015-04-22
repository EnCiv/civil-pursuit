! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'syn/models/User',
    'syn/models/Config',
    'syn/lib/util/connect-to-mongoose',
    'should'
  ];

  module.exports = function test__models__User__statics__disposable (done) {
    var disposable;

    di(done, deps, function (domain, Test, User, Config, mongoUp) {

      var mongo = mongoUp();

      try {
        should.Assertion.add('User', require('../.User'), true);
      }
      catch ( error ) {
        // Assertion item already loaded
      }

      function test__models__User__statics__disposable____createUser (done) {

        User.disposable(domain.intercept(function (user) {

          disposable = user;

          user.should.be.a.User;

          done();
        }));

      }

      function test__models__User__statics__disposable____cleanOut (done) {
        disposable.remove(domain.intercept(function () {
          mongo.disconnect(done);  
        }));
      }

      Test([

          test__models__User__statics__disposable____createUser,
          test__models__User__statics__disposable____cleanOut

        ], done);

    });
    
  };

} ();
