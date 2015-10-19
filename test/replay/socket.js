'use strict';

import API                        from '../../app/api';
import { EventEmitter }           from 'events';
import should                     from 'should';
import fs                         from 'fs';
import path                       from 'path';
import S                          from 'string';
import socketClient               from 'socket.io-client';
import config                     from '../../secret.json';
import Item                       from '../../app/models/item';

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

  describe ( 'Methods' , function () {

    describe ( 'get top level type' , function () {

      let topLevelType;

      it ( 'should emit and get answer' , function (done) {

        client1
          .on('OK get top level type', type => {
            topLevelType = type;
            done();
          })
          .emit('get top level type');

      });

      describe ( 'Top level type', function () {

        it ( 'should be a type' , function () {

          topLevelType.should.be.a.typeDocument({ name : config['top level item'] }, { json : true });

        });

      });

    });

    describe ( 'get items' , function () {

      let expected, actual;

      describe ( 'Get expected panel items', function () {

        it ( 'should get panel items', function () {

        });

      });

    });
  });

});
