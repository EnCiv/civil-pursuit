! function () {
  
  'use strict';

  var should = require('should');

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'syn/models/User',
    'syn/lib/util/connect-to-mongoose',
    'syn/lib/util/random-string',
    'should'
  ];

  module.exports = function test__models__User__statics__identify (done) {

    var email, password, user;

    di(done, deps, function (domain, Test, User, mongoUp, randomString) {

      var mongo = mongoUp();

      function test__models__User__statics__identify____createsDisposableUser (done) {
        
        User.create({
          email     :   email,
          password  :   password
        },

        domain.intercept(function (randomUser) {
          user = randomUser;
          done();
        }));

      }

      function test__models__User__statics__identify____identifyDisposableUser (done) {
        
        User.identify(email, password, domain.intercept(function (identified) {
          identified._id.toString().should.be.exactly(user._id.toString());
          done();
        }));

      }

      function disconnect (done) {
        user.remove(domain.intercept(function () {
          mongo.disconnect(done);  
        }));
      }

      randomString(25, domain.intercept(function (random) {
        
        email       =   random.toLowerCase() + '@test.synapp.com';
        password    =   random;

        Test([

            test__models__User__statics__identify____createsDisposableUser,
            test__models__User__statics__identify____identifyDisposableUser,
            disconnect

          ], done);

      }));

    });
    
  };

} ();
