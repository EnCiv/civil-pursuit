! function () {
  
  'use strict';

  module.exports = function (done) {

    var should      =   require('should');

    

    var User        =   require('syn/models/User');
    var Config      =   require('syn/models/Config');

    var test        =   this;

    var Test        =   require('syn/lib/Test');

    var user_id, employment_id;

    Test.suite('User.setEmployment(user_id, employment_id)', {

      'should create a disposable user': function (done) {

        require('syn/lib/domain')(done, function (domain) {

          User

            .disposable(domain.intercept(function (user) {

              user_id = user._id;

              done();

            }));          

        });   
      },

      'should fetch status': function (done) {
        
        require('syn/lib/domain')(done, function (domain) {

          Config.findOne(domain.intercept(function (config) {

            employment_id = config.married[0]._id;

            done();

          }));

        });
      },

      'should be a function': function (done) {
        User.schema.statics.should.have.property('setEmployment').which.is.a.Function;
        done();
      },

      'should set marital status': function (done) {

        require('syn/lib/domain')(done, function (domain) {
          User.setEmployment(user_id, employment_id, domain.intercept(function (user) {

            user.should.be.a.user;

            user.should.have.property('employment')
              .which.is.an.Object;

            user.employment.toString().should.eql(employment_id.toString());

            user.remove();

            done();

          }));
        });

      }


    }, done)
  
  };

} ();
