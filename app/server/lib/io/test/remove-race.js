! function () {
  
  'use strict';

  module.exports = function (done) {
    
    var path        =   require('path');

    var should      =   require('should');

    

    var client      =  require('syn/io/test/socket').client;

    client.on('error', done);

    var Test        =   require('syn/lib/Test');

    var race_id;

    var user;

    try {
      should.Assertion.add('user', require('syn/models/test/User/assert.user'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    Test.suite('Socket "remove race"', {

      'add a listener': function (done) {
        client.on('remove race',require('syn/io/remove-race').bind(client));
        client.on('add race',require('syn/io/add-race').bind(client));

        done();
      },

      'adding a race': function (done) {

        require('syn/lib/domain')(done, function (domain) {
          client.on('race added', function (item) {

            item.should.be.an.item;

            done();
          });

          require('syn/models/User')
            .disposable(domain.intercept(function (_user) {

              user = _user;

              user.should.be.a.user;

              require('syn/models/Config')

                .findOne(domain.intercept(function (config) {
                  race_id = config.race[0]._id;

                  client.emit('add race', user._id, race_id);
                }));

            }));
          });

      },

      'remove that race': function (done) {

        require('syn/lib/domain')(done, function (domain) {
          client.on('race removed', function (item) {

            item.should.be.an.item;

            user.remove();

            done();
          });

          client.emit('remove race', user._id, race_id);
        });

      }

    }, done);

  };

} ();
