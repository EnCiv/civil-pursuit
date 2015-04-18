! function () {
  
  'use strict';

  module.exports = function (done) {
    
    var path        =   require('path');

    var should      =   require('should');

    

    var client      =  require('syn/io/test/socket').client;

    client.on('error', done);

    var Test        =   require('syn/lib/Test');

    var country_id;

    var user;

    try {
      should.Assertion.add('user', require('syn/models/test/User/assert.user'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    Test.suite('Socket "remove citizenship"', {

      'add a listener': function (done) {
        client.on('remove citizenship',require('syn/io/remove-citizenship').bind(client));
        client.on('add citizenship',require('syn/io/add-citizenship').bind(client));

        done();
      },

      'adding a citizenship': function (done) {

        require('syn/lib/domain')(done, function (domain) {
          client.on('citizenship added', function (user) {

            user.should.be.a.user;

            done();
          });

          require('syn/models/User')
            .disposable(domain.intercept(function (_user) {

              user = _user;

              user.should.be.a.user;

              require('syn/models/Country')

                .findOne(domain.intercept(function (country) {
                  country_id = country._id;

                  client.emit('add citizenship', user._id, country_id);
                }));

            }));
          });

      },

      'remove that citizenship': function (done) {

        require('syn/lib/domain')(done, function (domain) {
          client.on('citizenship removed', function (user) {

            user.should.be.a.user;

            user.remove();

            done();
          });

          client.emit('remove citizenship', user._id, country_id);
        });

      }

    }, done);

  };

} ();
