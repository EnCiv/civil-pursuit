! function () {
  
  'use strict';

  module.exports = function (done) {
    
    var path        =   require('path');

    var should      =   require('should');

    

    var client      =  require('syn/io/test/socket').client;

    client.on('error', done);

    var Test        =   require('syn/lib/Test');

    var user;

    function randomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    }

    var birthdate = randomDate(new Date(1950, 0, 9), new Date());

    try {
      should.Assertion.set('user', require('syn/models/test/User/assert.user'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    Test.suite('Socket "set birthdate"', {

      'add a listener': function (done) {
        client.on('set birthdate',require('syn/io/set-birthdate').bind(client));

        done();
      },

      'should send "birthdate set"': function (done) {

        require('syn/lib/domain')(done, function (domain) {
          client.on('birthdate set', function (user_id) {

            user_id.should.be.an.Object;

            user.remove();

            done();
          });

          require('syn/models/User')
            .disposable(domain.intercept(function (_user) {

              user =  _user;

              user.should.be.a.user;

              client.emit('set birthdate', user._id, birthdate);

            }));
          });

      }

    }, done);

  };

} ();
