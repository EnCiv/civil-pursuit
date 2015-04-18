! function () {
  
  'use strict';

  module.exports = function (done) {

    var should      =   require('should');

    var src         =   require(require('path').join(process.cwd(), 'src'));

    var User        =   src('models/User');

    var Country     =   src('models/Country');

    var test        =   this;

    var Test        =   src('lib/Test');

    var user;

    try {
      should.Assertion.add('user', src('models/test/User/assert.user'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    var is_registered = !! Math.round(Math.random());

    Test.suite('User.setRegisteredVoter(user_id, is_registered)', {

      'should create a disposable user': function (done) {

        src.domain(done, function (domain) {

          User

            .disposable(domain.intercept(function (_user) {

              user = _user;

              done();

            }));          

        });   
      },

      'should be a function': function (done) {
        User.schema.statics.should.have.property('setRegisteredVoter').which.is.a.Function;
        done();
      },

      'should set registered voter': function (done) {

        src.domain(done, function (domain) {
          User.setRegisteredVoter(user._id, is_registered, domain.intercept(function (num) {
            
            num.should.be.a.Number.and.eql(1);

            user.remove();

            done();

          }));
        });

      }


    }, done)
  
  };

} ();
