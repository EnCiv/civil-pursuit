! function () {
  
  'use strict';

  module.exports = function (done) {

    var should      =   require('should');

    var src         =   require(require('path').join(process.cwd(), 'src'));

    var User        =   src('models/User');
    var Config      =   src('models/Config');

    var test        =   this;

    var Test        =   src('lib/Test');

    var user_id, status_id;

    Test.suite('User.setMaritalStatus(user_id, status_id)', {

      'should create a disposable user': function (done) {

        src.domain(done, function (domain) {

          User

            .disposable(domain.intercept(function (user) {

              user_id = user._id;

              done();

            }));          

        });   
      },

      'should fetch status': function (done) {
        
        src.domain(done, function (domain) {

          Config.findOne(domain.intercept(function (config) {

            status_id = config.married[0]._id;

            done();

          }));

        });
      },

      'should be a function': function (done) {
        User.schema.statics.should.have.property('setMaritalStatus').which.is.a.Function;
        done();
      },

      'should set marital status': function (done) {

        src.domain(done, function (domain) {
          User.setMaritalStatus(user_id, status_id, domain.intercept(function (user) {

            user.should.be.a.user;

            user.should.have.property('married')
              .which.is.an.Object;

            user.married.toString().should.eql(status_id.toString());

            user.remove();

            done();

          }));
        });

      },

      // 'should allow user to log in with new password': function (done) {
      //   User.identify(process.env.SYNAPP_TEST_EMAIL, process.env.SYNAPP_TEST_PASSWORD, function (error, user) {
      //     if ( error ) {
      //       return done(error);
      //     }
      //     if ( ! user ) {
      //       return done(new Error('Could not identify test user with new password ' + process.env.SYNAPP_TEST_EMAIL));
      //     }
      //     user.email.should.eql(process.env.SYNAPP_TEST_EMAIL);
      //     done();
      //   });
      // }


    }, done)
  
  };

} ();
