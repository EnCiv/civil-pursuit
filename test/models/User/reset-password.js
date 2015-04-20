! function () {
  
  'use strict';

  module.exports = function (done) {

    var should      =   require('should');

    

    var User        =   require('syn/models/User');

    var test        =   this;

    var Test        =   require('syn/lib/Test');

    var key;

    var token;

    Test.suite('Model User Statics resetPassword', {
      'there should be an environment variable called "SYNAPP_TEST_EMAIL"': function (done) {
        process.env.SYNAPP_TEST_EMAIL.should.be.a.String;
        done();
      },

      'there should be an environment variable called "SYNAPP_TEST_PASSWORD"': function (done) {
        process.env.SYNAPP_TEST_PASSWORD.should.be.a.String;
        done();
      },

      'should fetch user': function (done) {
        User

          .findOne({ email: process.env.SYNAPP_TEST_EMAIL })

          .exec(function (error, user) {

            if ( error ) {
              return done(error);
            }

            if ( ! user ) {
              return done(new Error('Could not find test user ' + process.env.SYNAPP_TEST_EMAIL));
            }

            key = user.activation_key;
            token = user.activation_token;

            done();

          });
      },

      'should be a function': function (done) {
        User.schema.statics.should.have.property('resetPassword').which.is.a.Function;
        done();
      },

      'should reset password on the model': function (done) {
        User.resetPassword(key, token, process.env.SYNAPP_TEST_PASSWORD, function (error) {
          if ( error ) {
            return done(error);
          }

          done();
        });
      },

      'should allow user to log in with new password': function (done) {
        User.identify(process.env.SYNAPP_TEST_EMAIL, process.env.SYNAPP_TEST_PASSWORD, function (error, user) {
          if ( error ) {
            return done(error);
          }
          if ( ! user ) {
            return done(new Error('Could not identify test user with new password ' + process.env.SYNAPP_TEST_EMAIL));
          }
          user.email.should.eql(process.env.SYNAPP_TEST_EMAIL);
          done();
        });
      }


    }, done)
  
  };

} ();
