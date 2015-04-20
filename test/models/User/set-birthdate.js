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

    function randomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    }

    var birthdate = randomDate(new Date(1950, 0, 9), new Date());

    Test.suite('User.setBirthdate(user_id, birthdate)', {

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
        User.schema.statics.should.have.property('setBirthdate').which.is.a.Function;
        done();
      },

      'should set birthdate': function (done) {

        require('syn/lib/domain')(done, function (domain) {
          User.setBirthdate(user._id, birthdate, domain.intercept(function (num) {
            
            num.should.be.a.Number.and.eql(1);

            user.remove();

            done();

          }));
        });

      }


    }, done)
  
  };

} ();
