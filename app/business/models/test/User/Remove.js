! function () {
  
  'use strict';

  module.exports = function (done) {
    var src = require(require('path').join(process.cwd(), 'src'));

    var Test = src('lib/Test');

    var User = src('models/User');

    var user;

    var test = this;

    var should = require('should');

    Test.suite('Model User Remove', {

      'this should be an object': function (done) {
        test.should.be.an.Object;
        done();
      },

      'this should have an email': function (done) {
        test.should.have.property('email').which.is.a.String;
        done();
      },

      'should remove User': function (done) {
        User.remove({ email: test.email }, function (error, removed) {

          if ( error ) {
            return done(error);
          }

          if ( ! removed ) {
            return done(new Error('No such user'));
          }

          done();
        });
      }

    }, done);
  };

} ();
