! function () {
  
  'use strict';

  module.exports = function (done) {

    var should    =   require('should');

    var src       =   require(require('path').join(process.cwd(), 'src'));

    var User      =   require('syn/models/User');

    var test      =   this;

    var Test      =   require('syn/lib/Test');

    Test.suite('User.makePasswordResettable()', {

      'there should be an environment variable called "SYNAPP_TEST_EMAIL"': function (done) {
        process.env.SYNAPP_TEST_EMAIL.should.be.a.String;
        done();
      },

      'should be a function': function (done) {
        User.schema.statics
          .should.have.property('makePasswordResettable')
          .which.is.a.Function;

        done();
      },

      'should emit a callback': function (done) {
        User.makePasswordResettable(process.env.SYNAPP_TEST_EMAIL, function (error, keys) {
          if ( error ) {
            return done(error);
          }

          keys.should.be.an.Object;

          keys
            .should.have.property('key').which.is.a.String;

          keys
            .should.have.property('key').which.is.a.String;

          done();
        });
      }

    }, done);

  };

} ();
