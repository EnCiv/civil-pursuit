! function () {
  
  'use strict';

  module.exports = function (done) {

    var should      =   require('should');

    

    var User        =   require('syn/models/User');

    var Country     =   require('syn/models/Country');

    var test        =   this;

    var Test        =   require('syn/lib/Test');

    var user;

    try {
      should.Assertion.add('user', require('syn/models/test/User/assert.user'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    var is_registered = !! Math.round(Math.random());

    Test.suite('User.setRegisteredVoter(user_id, is_registered)', {

      'should create a disposable user': function (done) {

        require('syn/lib/domain')(done, function (domain) {

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

        require('syn/lib/domain')(done, function (domain) {
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
