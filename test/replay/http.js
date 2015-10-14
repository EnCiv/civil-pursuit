'use strict';

import Server from '../../app/server';

process.env.PORT = 13012;

describe ( 'HTTP server' , function () {

  describe ( 'Start' , function () {

    let server;

    it ( 'should start a new HTTP server', function (done) {

      server = new Server();

      server.on('listening', () => done());

    });

  });

});
