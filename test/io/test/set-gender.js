! function () {
  
  'use strict';

  module.exports = function (done) {
    
    var path        =   require('path');

    var should      =   require('should');

    

    var client      =  require('syn/io/test/socket').client;

    client.on('error', done);

    var Test        =   require('syn/lib/Test');

    var user;

    var gender = ['M', 'F'][Math.round(Math.random())];

    try {
      should.Assertion.set('user', require('syn/models/test/User/assert.user'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    Test.suite('Socket "set gender"', {

      'add a listener': function (done) {
        client.on('set gender',require('syn/io/set-gender').bind(client));

        done();
      },

      'should send "gender set"': function (done) {

        require('syn/lib/domain')(done, function (domain) {
          client.on('gender set', function (user_id) {

            user_id.should.be.an.Object;

            user.remove();

            done();
          });

          require('syn/models/User')
            .disposable(domain.intercept(function (_user) {

              user =  _user;

              user.should.be.a.user;

              client.emit('set gender', user._id, gender);

            }));
          });

      }

    }, done);

  };

} ();
