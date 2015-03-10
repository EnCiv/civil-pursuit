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

    var position    =   Math.round(Math.random());

    try {
      should.Assertion.set('user', src('models/test/User/assert.user'), true);
      should.Assertion.set('country', src('models/test/Country/assert'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    Test.suite('Socket "set citizenship"', {

      'add a listener': function (done) {
        client.on('set citizenship', src('io/set-citizenship').bind(client));

        done();
      },

      'should send "citizenship set"': function (done) {

        src.domain(done, function (domain) {
          client.on('citizenship set', function (user) {

            user.should.be.a.user;

            user.remove();

            done();
          });

          src('models/User')
            .disposable(domain.intercept(function (_user) {

              user =  _user;

              user.should.be.a.user;

              src('models/Country')

                .findOne(domain.intercept(function (country) {
                  client.emit('set citizenship', user._id, country._id, position);
                }));

            }));
          });

      }

    }, done);

  };

} ();
