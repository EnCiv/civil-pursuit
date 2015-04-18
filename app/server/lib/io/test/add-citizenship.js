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
      should.Assertion.add('country', require('syn/models/test/Country/assert'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    Test.suite('Socket "add citizenship"', {

      'add a listener': function (done) {
        client.on('add citizenship',require('syn/io/add-citizenship').bind(client));

        done();
      },

      'should send "citizenship added"': function (done) {

        require('syn/lib/domain')(done, function (domain) {
          client.on('citizenship added', function (user) {

            user.should.be.a.user;

            user.remove();

            done();
          });

          require('syn/models/User')
            .disposable(domain.intercept(function (_user) {

              user =  _user;

              user.should.be.a.user;

              require('syn/models/Country')

                .findOne(domain.intercept(function (country) {
                  client.emit('add citizenship', user._id, country._id);
                }));

            }));
          });

      }

    }, done);

  };

} ();
