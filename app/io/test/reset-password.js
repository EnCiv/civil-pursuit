! function () {
  
  'use strict';

  /**
   *  @function socketResetPassword
   *  @this     { email: String, password: String }
   */

  module.exports = function socketResetPassword (done) {

    var should      =   require('should');

    

    var client      =  require('syn/io/test/socket').client;

    client.on('error', done);

    var test        =   this;

    var Test        =   require('syn/lib/Test');

    var User        =   require('syn/models/User');

    var key;

    var token;

    Test.suite('Socket "reset password"', {

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

      'should find user with email': function (done) {
        User

          .findOne({ email: test.email })

          .lean()

          .exec(function (error, user) {

            if ( error ) {
              return done(error);
            }

            if ( ! user ) {
              return done(new Error('No such email'));
            }

            key = user.activation_key;
            token = user.activation_token;

            done();

          });
      },

      'should have activation key': function (done) {
        key.should.be.a.String;
        done();
      },

      'should have activation token': function (done) {
        token.should.be.a.String;
        done();
      },

      'add a listener': function (done) {
        client.on('reset password',require('syn/io/reset-password').bind(client));

        done();
      },

      'should send "reset password ok"': function (done) {

        client.on('reset password ok', done);

        client.emit('reset password', key, token, test.password);

      },

      'should be able to identify with new password': function (done) {

        User.identify(test.email, test.password, function (error, user) {

          if ( error ) {
            return done(error);
          }

          if ( ! user ) {
            return done(new Error('Could not identify'));
          }

          if ( user.email !== test.email ) {
            return done(new Error('Email mismatch'));
          }

          done();

        });

      }

    }, done);

  };

} ();
