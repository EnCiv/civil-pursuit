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

    var gender = ['M', 'F'][Math.round(Math.random())];

    Test.suite('User.setGender(user_id, gender)', {

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
        User.schema.statics.should.have.property('setGender').which.is.a.Function;
        done();
      },

      'should set gender': function (done) {

        require('syn/lib/domain')(done, function (domain) {
          User.setGender(user._id, gender, domain.intercept(function (num) {
            
            num.should.be.a.Number.and.eql(1);

            user.remove();

            done();

          }));
        });

      }


    }, done)
  
  };

} ();
