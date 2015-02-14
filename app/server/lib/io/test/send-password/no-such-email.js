! function () {
  
  'use strict';

  module.exports = function (done) {
    
    var path        =   require('path');

    var should      =   require('should');

    var src         =   require(require('path').join(process.cwd(), 'src'));

    var client      =   src('io/test/socket').client;

    client.on('error', done);

    var test        =   this;

    var Test        =   src('lib/Test');

    Test.suite('Socket "send password" no such email', {

      'this should be an object': function (done) {
        test.should.be.an.Object;
        done();
      },

      'this should have an email': function (done) {
        test.should.have.property('email').which.is.a.String;
        done();
      },

      'add a listener': function (done) {
        client.on('send password', src('io/send-password').bind(client));

        done();
      },

      'should send "no such email"': function (done) {

        client.on('no such email', function (email) {
          email.should.be.a.String.and.eql(test.email);

          done();
        });

        client.emit('send password', test.email);

      }

    }, done);

  };

} ();
