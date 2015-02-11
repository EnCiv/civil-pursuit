! function () {
  
  'use strict';

  var should = require('should');

  describe('User Model', function () {

    var User;

    before(function () {
      User = require('../User');
    });

    it ( 'should be a function', function () {
      User.should.be.a.Function;
    });

    it ( 'its prototype should be an instanceof model', function () {
      User.prototype.constructor.name.should.eql('model');
    });

    it ( 'which extends EventEmitter', function () {
      User.prototype.should.be.an.instanceof(require('events').EventEmitter);
    });

    it ( 'should have a schema property', function () {
      User.schema.should.be.an.Object;
    });

    describe ( 'User Model Static Methods', function () {

      it ('should have static methods', function () {
        User.schema.statics.should.be.an.Object;
      });

      it ( 'should have a static method called isValidPassword', function () {
        User.schema.statics.should.have.property('isValidPassword').which.is.a.Function;
      });

      it ( 'should have a static method called identify', function () {
        User.schema.statics.should.have.property('identify').which.is.a.Function;
      });

      it ( 'should have a static method called saveImage', function () {
        User.schema.statics.should.have.property('saveImage').which.is.a.Function;
      });
    });

    describe ( 'Query User', function () {

      describe ( 'User.create', function () {

        var new_user = {
          'email': 'test@user.com',
          'password': 'ddjjd3t67t3dhwvghwf·RTGED'
        };

        it ( 'should create a new user', function (done) {
          var user;

          User.create(new_user, function (error, created) {
            if ( error ) {
              return done(error);
            }
            user = created;
            done();
          });

          describe ( 'new user' , function () {

            it ( 'should be an object', function () {
              user.should.be.an.Object;
            });

            it ( 'should have properties', function () {
              (Object.keys(user)).length.should.not.eql(0);
            });

            it ( 'should have email ' + new_user.email, function () {
              user.should.have.property('email')
                .which.is.a.String
                .and.eql(new_user.email);
            });

            it ( 'should have an encrypted password', function () {
              user.should.have.property('password')
                .which.is.a.String
                .and.not.eql(new_user.password);
            });

          });
        });

      });

    });

  });

} ();
