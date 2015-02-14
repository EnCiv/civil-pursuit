! function () {
  
  'use strict';

  module.exports = function (done) {

    var should    =   require('should');

    var src       =   require(require('path').join(process.cwd(), 'src'));

    var User      =   src('models/User');

    var test      =   this;

    var Test      =   src('lib/Test');

    Test.suite('User.makePasswordResettable()', {

      'this should be an object': function (done) {
        test.should.be.an.Object;
        done();
      },

      'this should have an email': function (done) {
        test.should.have.property('email').which.is.a.String;
        done();
      },

      'should be a function': function (done) {
        User.schema.statics
          .should.have.property('makePasswordResettable')
          .which.is.a.Function;

        done();
      },

      'should emit a callback': function (done) {
        User.makePasswordResettable(test.email, function (error, keys) {
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
