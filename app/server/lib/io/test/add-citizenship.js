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
      should.Assertion.add('country', src('models/test/Country/assert'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    Test.suite('Socket "add citizenship"', {

      'add a listener': function (done) {
        client.on('add citizenship', src('io/add-citizenship').bind(client));

        done();
      },

      'should send "citizenship added"': function (done) {

        src.domain(done, function (domain) {
          client.on('citizenship added', function (user) {

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
                  client.emit('add citizenship', user._id, country._id);
                }));

            }));
          });

      }

    }, done);

  };

} ();
