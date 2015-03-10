! function () {
  
  'use strict';

  module.exports = function (done) {
    
    var path        =   require('path');

    var should      =   require('should');

    var src         =   require(require('path').join(process.cwd(), 'src'));

    var client      =   src('io/test/socket').client;

    client.on('error', done);

    var Test        =   src('lib/Test');

    try {
      should.Assertion.add('country', src('models/test/Country/assert'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    Test.suite('Socket "get countries"', {

      'add a listener': function (done) {
        client.on('get countries', src('io/get-countries').bind(client));

        done();
      },

      'should send "got countries"': function (done) {

        src.domain(done, function (domain) {
          client.on('got countries', function (countries) {

            countries.should.be.an.Array;

            countries.forEach(function (country) {
              country.should.be.a.country;
            });

            done();
          });

          client.emit('get countries');  
        });

      }

    }, done);

  };

} ();
