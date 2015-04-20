! function () {
  
  'use strict';

  module.exports = function (done) {
    
    var path        =   require('path');

    var should      =   require('should');

    var client      =  require('syn/io/test/socket').client;

    client.on('error', done);

    var Test        =   require('syn/lib/Test');

    var user;

    try {
      should.Assertion.add('user', require('syn/models/test/User/assert.user'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    function getRandom(min, max) {
      return Math.random() * (max - min) + min;
    }

    Test.suite('Socket "set party"', {

      'add a listener': function (done) {
        client.on('set party',require('syn/io/set-party').bind(client));

        done();
      },

      'should send "party set"': function (done) {

        require('syn/lib/domain')(done, function (domain) {
          client.on('party set', function (user_id) {

            user_id.toString().should.be.exactly(user._id.toString());

            user.remove();

            done();
          });

          require('syn/models/User')
            .disposable(domain.intercept(function (_user) {

              user =  _user;

              user.should.be.a.user;

              require('syn/models/Config')

                .findOne(domain.intercept(function (config) {
                  client.emit('set party', user._id, config.party[Math.round(getRandom(0, config.party.length - 1))]._id);
                }));

            }));
          });

      }

    }, done);

  };

} ();
