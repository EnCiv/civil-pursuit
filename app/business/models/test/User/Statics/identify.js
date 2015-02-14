! function () {
  
  'use strict';

  module.exports = function (done) {
    var should    =   require('should');

    var src       =   require(require('path').join(process.cwd(), 'src'));

    var User      =   src('models/User');

    var Test      =   src('lib/Test');

    var test      =   this;

    var user;

    Test.suite('Model User Statics Identify', {
      
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

      'should identify user': function (done) {
        User.identify(test.email, test.password, function (error, _user) {

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
          .and.eql(test.email);
        done();
      },

      'identified user should have a different password': function (done) {
        should(user).have.property('password')
          .which.is.a.String
          .and.not.eql(test.password);

        done();
      }

    }, done);
  };

} ();
