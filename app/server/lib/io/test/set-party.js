! function () {
  
  'use strict';

  module.exports = function (done) {
    
    var path        =   require('path');

    var should      =   require('should');

    var src         =   require(require('path').join(process.cwd(), 'src'));

    var client      =   src('io/test/socket').client;

    client.on('error', done);

    var Test        =   src('lib/Test');

    var user;

    try {
      should.Assertion.add('user', src('models/test/User/assert.user'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    function getRandom(min, max) {
      return Math.random() * (max - min) + min;
    }

    Test.suite('Socket "set party"', {

      'add a listener': function (done) {
        client.on('set party', src('io/set-party').bind(client));

        done();
      },

      'should send "party set"': function (done) {

        src.domain(done, function (domain) {
          client.on('party set', function (user_id) {

            user_id.toString().should.be.exactly(user._id.toString());

            user.remove();

            done();
          });

          src('models/User')
            .disposable(domain.intercept(function (_user) {

              user =  _user;

              user.should.be.a.user;

              src('models/Config')

                .findOne(domain.intercept(function (config) {
                  client.emit('set party', user._id, config.party[Math.round(getRandom(0, config.party.length - 1))]._id);
                }));

            }));
          });

      }

    }, done);

  };

} ();
