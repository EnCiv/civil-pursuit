! function () {
  
  'use strict';

  module.exports = function (done) {

    var should      =   require('should');

    var src         =   require(require('path').join(process.cwd(), 'src'));

    var User        =   src('models/User');

    var test        =   this;

    var Test        =   src('lib/Test');

    var key;

    var token;

    Test.suite('Model User Statics resetPassword', {
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

      'should fetch user': function (done) {
        User

          .findOne({ email: test.email })

          .exec(function (error, user) {

            if ( error ) {
              return done(error);
            }

            if ( ! user ) {
              return done(new Error('Could not find test user ' + test.email));
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
        User.resetPassword(key, token, test.password, function (error) {
          if ( error ) {
            return done(error);
          }

          done();
        });
      },

      'should allow user to log in with new password': function (done) {
        User.identify(test.email, test.password, function (error, user) {
          if ( error ) {
            return done(error);
          }
          if ( ! user ) {
            return done(new Error('Could not identify test user with new password ' + test.email));
          }
          user.email.should.eql(test.email);
          done();
        });
      }


    }, done)
  
  };

} ();
