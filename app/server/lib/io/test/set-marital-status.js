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

    try {
      should.Assertion.add('user', src('models/test/User/assert.user'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    Test.suite('Socket "set marital status"', {

      'add a listener': function (done) {
        client.on('set marital status', src('io/set-marital-status').bind(client));

        done();
      },

      'should send "marital status set"': function (done) {

        src.domain(done, function (domain) {
          client.on('marital status set', function (user) {

            user.should.be.an.user;

            user.remove();

            done();
          });

          src('models/User')
            .disposable(domain.intercept(function (_user) {

              user =  _user;

              user.should.be.a.user;

              src('models/Config')

                .findOne(domain.intercept(function (config) {
                  client.emit('set marital status', user._id, config.married[0]._id);
                }));

            }));
          });

      }

    }, done);

  };

} ();
