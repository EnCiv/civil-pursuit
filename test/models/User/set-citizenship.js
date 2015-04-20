! function () {
  
  'use strict';

  module.exports = function (done) {

    var should      =   require('should');

    

    var User        =   require('syn/models/User');

    var Country     =   require('syn/models/Country');

    var test        =   this;

    var Test        =   require('syn/lib/Test');

    var user_id, country_id;

    try {
      should.Assertion.add('user', require('syn/models/test/User/assert.user'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    var position = Math.round(Math.random());

    Test.suite('User.setCitizenship(user_id, country_id, position)', {

      'should create a disposable user': function (done) {

        require('syn/lib/domain')(done, function (domain) {

          User

            .disposable(domain.intercept(function (user) {

              user_id = user._id;

              done();

            }));          

        });   
      },

      'should fetch country': function (done) {
        
        require('syn/lib/domain')(done, function (domain) {

          Country.findOne(domain.intercept(function (country) {

            country_id = country._id;

            done();

          }));

        });
      },

      'should be a function': function (done) {
        User.schema.statics.should.have.property('setCitizenship').which.is.a.Function;
        done();
      },

      'should add citizenship': function (done) {

        require('syn/lib/domain')(done, function (domain) {
          User.setCitizenship(user_id, country_id, position, domain.intercept(function (user) {
            
            user.should.be.a.user;

            user.should.have.property('citizenship')
              .which.is.an.Array;

            user.citizenship[position].should.eql(country_id);

            // console.log(user.citizenship, position, country_id)

            user.remove();

            done();

          }));
        });

      }


    }, done)
  
  };

} ();
