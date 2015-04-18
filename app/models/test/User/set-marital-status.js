! function () {
  
  'use strict';

  module.exports = function (done) {

    var should      =   require('should');

    

    var User        =   require('syn/models/User');
    var Config      =   require('syn/models/Config');

    var test        =   this;

    var Test        =   require('syn/lib/Test');

    var user_id, status_id;

    Test.suite('User.setMaritalStatus(user_id, status_id)', {

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

        require('syn/lib/domain')(done, function (domain) {
          User.setMaritalStatus(user_id, status_id, domain.intercept(function (user) {

            user.should.be.a.user;

            user.should.have.property('married')
              .which.is.an.Object;

            user.married.toString().should.eql(status_id.toString());

            user.remove();

            done();

          }));
        });

      }


    }, done)
  
  };

} ();
