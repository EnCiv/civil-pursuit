'use strict';

import API                        from '../../app/api';
import { EventEmitter }           from 'events';
import should                     from 'should';
import fs                         from 'fs';
import path                       from 'path';
import S                          from 'string';
import socketClient               from 'socket.io-client';

const http = global.syn_httpServer;

const url = 'http://localhost:13012';

let server;

let client1;

describe ( 'Socket' , function () {

  describe ( 'Connect' , function () {

    describe ( 'Client' , function () {

      it ( 'should connect', function (done) {

        client1 = socketClient.connect(url, {
          transports: ['websocket'],
          'force new connection': true
        });

        client1.on('connect', data => {
          done();
        });

      });

    });

  });

});
