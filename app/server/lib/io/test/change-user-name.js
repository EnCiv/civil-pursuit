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

    Test.suite('Socket "change user name"', {

      'add a listener': function (done) {
        client.on('change user name',require('syn/io/change-user-name').bind(client));

        done();
      },

      'should send "user name changed"': function (done) {

        require('syn/lib/domain')(done, function (domain) {
          client.on('user name changed', function (number) {

            number.should.be.exactly(1);

            user.remove();

            done();
          });

          require('syn/models/User')
            .disposable(domain.intercept(function (_user) {

              user =  _user;

              user.should.be.a.user;

              client.emit('change user name', user._id, {
                first_name:       'First '  +   Math.random(),
                middle_name:      'Middle ' +   Math.random(),
                last_name:        'Last '   +   Math.random(),
              });

            }));
          });

      }

    }, done);

  };

} ();
