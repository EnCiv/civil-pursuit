! function () {
  
  'use strict';

  module.exports = function (done) {

    var should      =   require('should');

    var src         =   require(require('path').join(process.cwd(), 'src'));

    var User        =   src('models/User');

    var Country     =   src('models/Country');

    var test        =   this;

    var Test        =   src('lib/Test');

    var user_id, country_id;

    try {
      should.Assertion.add('user', src('models/test/User/assert.user'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    Test.suite('User.addCitizenship(user_id, country_id)', {

      'should create a disposable user': function (done) {

        src.domain(done, function (domain) {

          User

            .disposable(domain.intercept(function (user) {

              user_id = user._id;

              done();

            }));          

        });   
      },

      'should fetch country': function (done) {
        
        src.domain(done, function (domain) {

          Country.findOne(domain.intercept(function (country) {

            country_id = country._id;

            done();

          }));

        });
      },

      'should be a function': function (done) {
        User.schema.statics.should.have.property('addCitizenship').which.is.a.Function;
        done();
      },

      'should add citizenship': function (done) {

        src.domain(done, function (domain) {
          User.addCitizenship(user_id, country_id, domain.intercept(function (user) {
            
            user.should.be.a.user;

            user.should.have.property('citizenship')
              .which.is.an.Array;

            user.citizenship[0].should.eql(country_id);

            user.remove();

            done();

          }));
        });

      }


    }, done)
  
  };

} ();
