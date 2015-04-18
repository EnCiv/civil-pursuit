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

    Test.suite('Socket "set employment"', {

      'add a listener': function (done) {
        client.on('set employment',require('syn/io/set-employment').bind(client));

        done();
      },

      'should send "employment set"': function (done) {

        require('syn/lib/domain')(done, function (domain) {
          client.on('employment set', function (user) {

            user.should.be.an.user;

            user.remove();

            done();
          });

          require('syn/models/User')
            .disposable(domain.intercept(function (_user) {

              user =  _user;

              user.should.be.a.user;

              require('syn/models/Config')

                .findOne(domain.intercept(function (config) {
                  client.emit('set employment', user._id, config.employment[0]._id);
                }));

            }));
          });

      }

    }, done);

  };

} ();
