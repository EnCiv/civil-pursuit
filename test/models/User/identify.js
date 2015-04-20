! function () {
  
  'use strict';

  module.exports = function (done) {
    var should    =   require('should');

    var src       =   require(require('path').join(process.cwd(), 'src'));

    var User      =   require('syn/models/User');

    var Test      =   require('syn/lib/Test');

    var test      =   this;

    var user;

    Test.suite('Model User Statics Identify', {
      
      'there should be an enviornment variable called "SYNAPP_TEST_EMAIL"': function (done) {
        process.env.SYNAPP_TEST_EMAIL.should.be.a.String;
        done();
      },

      'there should be an enviornment variable called "SYNAPP_TEST_PASSWORD"': function (done) {
        process.env.SYNAPP_TEST_PASSWORD.should.be.a.String;
        done();
      },

      'should identify user': function (done) {
        User.identify(process.env.SYNAPP_TEST_EMAIL, process.env.SYNAPP_TEST_PASSWORD, function (error, _user) {

          if ( error ) {
            return done(error);
          }

          user = _user;

          done();
        });
      },

      'identified user should be an object': function (done) {
        should(user).be.an.Object;
        done();
      },

      'identified user should be an instance of model': function (done) {
        should(user.constructor.name).eql('model');
        done();
      },

      'identified user should have properties': function (done) {
        (Object.keys(user)).length.should.not.eql(0);
        done();
      },

      'identified user should have email': function (done) {
        should(user).have.property('email')
          .which.is.a.String
          .and.eql(process.env.SYNAPP_TEST_EMAIL);
        done();
      },

      'identified user should have a different password': function (done) {
        should(user).have.property('password')
          .which.is.a.String
          .and.not.eql(process.env.SYNAPP_TEST_PASSWORD);

        done();
      }

    }, done);
  };

} ();
