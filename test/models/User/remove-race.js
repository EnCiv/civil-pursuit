! function () {
  
  'use strict';

  module.exports = function (done) {

    var should      =   require('should');

    

    var User        =   require('syn/models/User');
    var Config      =   require('syn/models/Config');

    var test        =   this;

    var Test        =   require('syn/lib/Test');

    var user_id, race_id;

    try {
      should.Assertion.add('item', require('syn/models/test/User/assert.user'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    Test.suite('User.removeRace(user_id, race_id)', {

      'should create a disposable user': function (done) {

        require('syn/lib/domain')(done, function (domain) {

          User

            .disposable(domain.intercept(function (user) {

              user_id = user._id;

              done();

            }));          

        });   
      },

      'should fetch race': function (done) {
        
        require('syn/lib/domain')(done, function (domain) {

          Config.findOne(domain.intercept(function (config) {

            race_id = config.race[0]._id;

            done();

          }));

        });
      },

      'should be a function': function (done) {
        User.schema.statics.should.have.property('removeRace').which.is.a.Function;
        done();
      },

      'should add race': function (done) {

        require('syn/lib/domain')(done, function (domain) {
          User.addRace(user_id, race_id, domain.intercept(function (user) {
            
            user.should.be.a.user;

            user.should.have.property('race')
              .which.is.an.Array;

            user.race[0].should.eql(race_id);

            done();

          }));
        });

      },

      'should remove race': function (done) {

        require('syn/lib/domain')(done, function (domain) {
          User.removeRace(user_id, race_id, domain.intercept(function (user) {
            
            user.should.be.a.user;

            user.should.have.property('race')
              .which.is.an.Array;

            user.race.length.should.be.exactly(0);

            user.remove();

            done();

          }));
        });

      },



    }, done)
  
  };

} ();
