! function () {
  
  'use strict';

  module.exports = function testModelUserCreate (done) {

    var src = require(require('path').join(process.cwd(), 'src'));

    var Test = src('lib/Test');

    var User = src('models/User');

    var user;

    var should = require('should');

    Test.suite('Model User Create', {

      'there should be an enviornment variable called "SYNAPP_TEST_EMAIL"': function (done) {
        process.env.SYNAPP_TEST_EMAIL.should.be.a.String;
        done();
      },

      'there should be an enviornment variable called "SYNAPP_TEST_PASSWORD"': function (done) {
        process.env.SYNAPP_TEST_PASSWORD.should.be.a.String;
        done();
      },

      'should create a new User': function (done) {
        User.create({ email: process.env.SYNAPP_TEST_EMAIL, password: process.env.SYNAPP_TEST_PASSWORD }, function (error, created) {

          if ( error ) {
            return done(error);
          }

          user = created;

          done();
        });
      },

      'new user should be an object': function (done) {
        should(user).be.an.Object;
        done();
      },

      'should be an instance of model': function (done) {
        should(user.constructor.name).eql('model');
        done();
      },

      'should have properties': function (done) {
        (Object.keys(user)).length.should.not.eql(0);
        done();
      },

      'should have email': function (done) {
        should(user).have.property('email')
          .which.is.a.String
          .and.eql(process.env.SYNAPP_TEST_EMAIL);
        done();
      },

      'should have a password that is different from password': function (done) {
        should(user).have.property('password')
          .which.is.a.String
          .and.not.eql(process.env.SYNAPP_TEST_PASSWORD);

        done();
      }

    }, done);

  };

} ();
