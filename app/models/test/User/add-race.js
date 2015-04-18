! function () {
  
  'use strict';

  module.exports = function (done) {

    var should      =   require('should');

    var src         =   require(require('path').join(process.cwd(), 'src'));

    var User        =   src('models/User');
    var Config      =   src('models/Config');

    var test        =   this;

    var Test        =   src('lib/Test');

    var user_id, race_id;

    try {
      should.Assertion.add('item', src('models/test/User/assert.user'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    Test.suite('User.addRace(user_id, race_id)', {

      'should create a disposavle user': function (done) {

        src.domain(done, function (domain) {

          User

            .disposable(domain.intercept(function (user) {

              user_id = user._id;

              done();

            }));          

        });   
      },

      'should fetch race': function (done) {
        
        src.domain(done, function (domain) {

          Config.findOne(domain.intercept(function (config) {

            race_id = config.race[0]._id;

            done();

          }));

        });
      },

      'should be a function': function (done) {
        User.schema.statics.should.have.property('addRace').which.is.a.Function;
        done();
      },

      'should add race': function (done) {

        src.domain(done, function (domain) {
          User.addRace(user_id, race_id, domain.intercept(function (user) {
            
            user.should.be.a.user;

            user.should.have.property('race')
              .which.is.an.Array;

            user.race[0].should.eql(race_id);

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
