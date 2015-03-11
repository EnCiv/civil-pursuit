! function () {
  
  'use strict';

  module.exports = function (done) {

    var should      =   require('should');

    var src         =   require(require('path').join(process.cwd(), 'src'));

    var User        =   src('models/User');

    var Country     =   src('models/Country');

    var test        =   this;

    var Test        =   src('lib/Test');

    var user, party;

    try {
      should.Assertion.add('user', src('models/test/User/assert.user'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    function getRandom(min, max) {
      return Math.random() * (max - min) + min;
    }

    Test.suite('User.setParty(user_id, party_id)', {

      'should create a disposable user': function (done) {

        src.domain(done, function (domain) {

          User

            .disposable(domain.intercept(function (_user) {

              user = _user;

              done();

            }));          

        });   
      },

      'should fetch a party': function (done) {

        src.domain(done, function (domain) {

          src('models/Config')

            .findOne(domain.intercept(function (config) {

              party = config.party[Math.round(getRandom(0, config.party.length - 1))];

              done();

            }));          

        });   
      },

      'should be a function': function (done) {
        User.schema.statics.should.have.property('setParty').which.is.a.Function;
        done();
      },

      'should set party': function (done) {

        src.domain(done, function (domain) {
          User.setParty(user._id, party._id, domain.intercept(function (num) {
            
            num.should.be.exactly(1);

            user.remove();

            done();

          }));
        });

      }


    }, done)
  
  };

} ();
