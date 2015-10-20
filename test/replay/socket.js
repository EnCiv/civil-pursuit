'use strict';

import API                        from '../../app/api';
import { EventEmitter }           from 'events';
import should                     from 'should';
import fs                         from 'fs';
import path                       from 'path';
import S                          from 'string';
import socketClient               from 'socket.io-client';
import config                     from '../../secret.json';
import publicConfig               from '../../public.json';
import Item                       from '../../app/models/item';
import Type                       from '../../app/models/type';
import Mung                       from '../../app/lib/mung';
import { Popularity }             from '../../app/models/item/methods/get-popularity';
import Training                   from '../../app/models/training';
import isInstruction              from './assertions/training';

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

      let expected, actual, panelItems;

      describe ( 'Get expected panel items', function () {

        let panel = {}, res;

        it ( 'should get type', function (done) {

          Type.findOne({ name : config['top level item'] })
            .then(
              type => {
                panel.type = type;
                done();
              },
              done
            );

        });

        it ( 'should be a type', function () {

          panel.type.should.be.a.typeDocument({ name : config['top level item'] });

        });

        describe ( 'calling sockets' , function () {

          it ( 'should emit and receive' , function (done) {

            client1
              .on('OK get items', (panel, count, items) => {
                res = { panel, count, items };
                done();
              })
              .emit('get items', panel);

          });

        });

        describe ('items' , function () {

          it ( 'should be an object' , function () {

            res.should.be.an.Object();

          });

          it ( 'should be a panel' , function () {

            res.should.have.property('panel')
              .which.is.an.Object()
              .and.have.property('type')
              .which.is.an.Object()
              .and.have.property('_id')
              .which.is.exactly(panel.type._id.toString());

          });

          it ( 'should be have a count' , function () {

            res.should.have.property('count')
              .which.is.a.Number();

          });

          it ( 'should have an array of panel items' , function () {

            res.should.have.property('items')
              .which.is.an.Array();

            res.items.forEach(panelItem => {
              panelItem.should.be.a.panelItem({}, {}, true);
            });

          });

        });

      });

    });

    describe ( 'get training' , function () {

      let instructions, $instructions;

      describe ( 'Get training from db' , function () {

        it ( 'should get training' , function (done) {

          Training.find().then(
            documents => {
              instructions = documents;
              done();
            },
            done
          );

        });

        it ( 'should be instructions', function () {

          instructions.should.be.an.Array();

          instructions.length.should.be.above(0);

          instructions.forEach(instruction => instruction.should.be.an.instruction());

        });

      });

      describe ( 'get training from socket' , function () {

        it ( 'should emit and receive' , function (done) {

          client1
            .on('OK get training', instructions => {
              $instructions = instructions;
              done();
            })
            .emit('get training');

        });

        it ( 'should be an empty array' , function () {

          $instructions.should.be.an.Array().and.have.length(0);

        });

      });

    });

    describe ( 'get user info' , function () {

      describe ( 'get user', function () {

      });

    });

  });

});
