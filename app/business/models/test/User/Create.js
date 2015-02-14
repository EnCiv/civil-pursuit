! function () {
  
  'use strict';

  module.exports = function testModelUserCreate (done) {

    var src = require(require('path').join(process.cwd(), 'src'));

    var Test = src('lib/Test');

    var User = src('models/User');

    var user;

    var test = this;

    var should = require('should');

    Test.suite('Model User Create', {

      'this should be an object': function (done) {
        test.should.be.an.Object;
        done();
      },

      'this should have an email': function (done) {
        test.should.have.property('email').which.is.a.String;
        done();
      },

      'this should have an password': function (done) {
        test.should.have.property('password').which.is.a.String;
        done();
      },

      'should create a new User': function (done) {
        User.create({ email: test.email, password: test.password }, function (error, created) {

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
          .and.eql(test.email);
        done();
      },

      'should have a password that is different from password': function (done) {
        should(user).have.property('password')
          .which.is.a.String
          .and.not.eql(test.password);

        done();
      }

    }, done);

  };

} ();
