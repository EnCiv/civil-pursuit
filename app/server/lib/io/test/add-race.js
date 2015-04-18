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

    Test.suite('Socket "add race"', {

      'add a listener': function (done) {
        client.on('add race',require('syn/io/add-race').bind(client));

        done();
      },

      'should send "race added"': function (done) {

        require('syn/lib/domain')(done, function (domain) {
          client.on('race added', function (item) {

            item.should.be.an.item;

            user.remove();

            done();
          });

          require('syn/models/User')
            .disposable(domain.intercept(function (_user) {

              user =  _user;

              user.should.be.a.user;

              require('syn/models/Config')

                .findOne(domain.intercept(function (config) {
                  client.emit('add race', user._id, config.race[0]._id);
                }));

            }));
          });

      }

    }, done);

  };

} ();
