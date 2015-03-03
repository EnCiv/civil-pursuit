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
      should.Assertion.add('item', src('models/test/Item/assert'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    Test.suite('Socket "promote"', {

      'add a listener': function (done) {
        client.on('promote', src('io/promote').bind(client));

        done();
      },

      'should send "promoted"': function (done) {

        client.on('promoted', function (item) {

          item.should.be.an.item;

          done();
        });

        src('models/Item')
          .findOneRandom(function (error, item) {

            if ( error ) {
              return done(error);
            }

            item.should.be.an.item;

            client.emit('promote', item._id);

          });

      }

    }, done);

  };

} ();
