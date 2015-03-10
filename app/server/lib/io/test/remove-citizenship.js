! function () {
  
  'use strict';

  module.exports = function (done) {
    
    var path        =   require('path');

    var should      =   require('should');

    var src         =   require(require('path').join(process.cwd(), 'src'));

    var client      =   src('io/test/socket').client;

    client.on('error', done);

    var Test        =   src('lib/Test');

    var country_id;

    var user;

    try {
      should.Assertion.add('user', src('models/test/User/assert.user'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    Test.suite('Socket "remove citizenship"', {

      'add a listener': function (done) {
        client.on('remove citizenship', src('io/remove-citizenship').bind(client));
        client.on('add citizenship', src('io/add-citizenship').bind(client));

        done();
      },

      'adding a citizenship': function (done) {

        src.domain(done, function (domain) {
          client.on('citizenship added', function (user) {

            user.should.be.a.user;

            done();
          });

          src('models/User')
            .disposable(domain.intercept(function (_user) {

              user = _user;

              user.should.be.a.user;

              src('models/Country')

                .findOne(domain.intercept(function (country) {
                  country_id = country._id;

                  client.emit('add citizenship', user._id, country_id);
                }));

            }));
          });

      },

      'remove that citizenship': function (done) {

        src.domain(done, function (domain) {
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
