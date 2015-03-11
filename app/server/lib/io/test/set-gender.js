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

    var gender = ['M', 'F'][Math.round(Math.random())];

    try {
      should.Assertion.set('user', src('models/test/User/assert.user'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    Test.suite('Socket "set gender"', {

      'add a listener': function (done) {
        client.on('set gender', src('io/set-gender').bind(client));

        done();
      },

      'should send "gender set"': function (done) {

        src.domain(done, function (domain) {
          client.on('gender set', function (user_id) {

            user_id.should.be.an.Object;

            user.remove();

            done();
          });

          src('models/User')
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
