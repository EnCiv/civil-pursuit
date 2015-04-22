! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'syn/models/User',
    'syn/lib/util/connect-to-mongoose',
    'should'
  ];

  module.exports = function test__models__User__virtuals__fullName__get (done) {
    var user;

    di(done, deps, function (domain, Test, User, mongoUp) {

      var mongo = mongoUp();

      try {
        should.Assertion.add('User', require('../.User'), true);
      }
      catch ( error ) {
        // Assertion item already loaded
      }

      function test__models__User__virtuals__fullName__get____createUser (done) {

        User.disposable(domain.intercept(function (disposable) {

          user = disposable;

          user.should.be.a.User;

          user.first_name = 'John';
          user.middle_name = 'Robert';
          user.last_name = 'Doe';

          var fullName = user.fullName;

          fullName.should.be.a.String;

          fullName.should.be.exactly(user.first_name);

          user.save(done);

        }));

      }

      function test__models__User__virtuals__fullName__get____getFullName (done) {

        // User.findById(user._id)
        done();
      }

      function test__models__User__virtuals__fullName__get____cleanOut (done) {
        user.remove(domain.intercept(function () {
          mongo.disconnect(done);  
        }));
      }

      Test([

          test__models__User__virtuals__fullName__get____createUser,
          test__models__User__virtuals__fullName__get____getFullName,
          test__models__User__virtuals__fullName__get____cleanOut

        ], done);

    });
    
  };

} ();
