! function () {
  
  'use strict';

  module.exports = function (done) {

    var should    =   require('should');

    var src       =   require(require('path').join(process.cwd(), 'src'));

    var User      =   src('models/User');

    var test      =   this;

    var Test      =   src('lib/Test');

    Test.suite('User.encryptPassword()', {

      'there should be an enviornment variable called "SYNAPP_TEST_PASSWORD"': function (done) {
        process.env.SYNAPP_TEST_PASSWORD.should.be.a.String;
        done();
      },

      'should be a function': function (done) {
        User.schema.statics
          .should.have.property('encryptPassword')
          .which.is.a.Function;

        done();
      },

      'should emit a callback': function (done) {
        User.encryptPassword(process.env.SYNAPP_TEST_PASSWORD, function (error, result) {
          if ( error ) {
            return done(error);
          }

          result.should.be.a.String.which.is.not.eql(test.password);

          done();
        });
      }

    }, done);

  };

} ();
