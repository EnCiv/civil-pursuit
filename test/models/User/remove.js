! function () {
  
  'use strict';

  module.exports = function (done) {
    

    var Test = require('syn/lib/Test');

    var User = require('syn/models/User');

    var user;

    var test = this;

    var should = require('should');

    Test.suite('Model User Remove', {

      'there should be an enviornment variable called "SYNAPP_TEST_EMAIL"': function (done) {
        process.env.SYNAPP_TEST_EMAIL.should.be.a.String;
        done();
      },

      'should remove User': function (done) {
        User.remove({ email: process.env.SYNAPP_TEST_EMAIL }, function (error, removed) {

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
