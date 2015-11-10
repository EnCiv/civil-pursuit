'use strict';

import { EventEmitter }           from 'events';
import fs                         from 'fs';
import path                       from 'path';
import should                     from 'should';
import S                          from 'string';
import Mungo                      from 'mungo';
import socketClient               from 'socket.io-client';
import config                     from '../../secret.json';
import publicConfig               from '../../public.json';
import API                        from '../../app/api';
import Item                       from '../../app/models/item';
import Type                       from '../../app/models/type';
import User                       from '../../app/models/user';
import { Popularity }             from '../../app/models/item/methods/get-popularity';
import Training                   from '../../app/models/training';
import isInstruction              from '../../app/lib/assertions/training';
import isCountry                  from '../../app/lib/assertions/country';
import getUserInfo                from '../../app/api/get-user-info';
import getTraining                from '../../app/api/get-training';
import Country                    from '../../app/models/country';
import Config                     from '../../app/models/config';

const http = global.syn_httpServer;

const url = 'http://localhost:13012';

let server;

let client1;

let user1;

function Socket () {

  if ( ! Socket.socket ) {
    Socket.socket = new EventEmitter();

    // socket.handshake.headers.host

    Socket.socket.request = {
      headers: {
        host  : 'localhost:13012',
        cookie : 'synapp=j%3A%7B%22training%22%3Atrue%7D'
      }
    };

    Socket.socket.error = function (error) {
      Socket.socket.emit('error', error);
    };

    Socket.socket.ok = (event, ...responses) => {
      Socket.socket.emit('OK ' + event, ...responses);
    };
  }

  return Socket.socket;
}

const client2 = Socket();

const mock = (method, event, ...messages) => new Promise((ok, ko) => {
  try {
    const onError = error => ko(error);

    method.apply(client2, [event, ...messages]);

    client2
      .on('error', onError)
      .on(`OK ${event}`, (...messages) => {

        client2.removeListener('error', onError);

        ok(...messages);

      });
  }
  catch ( error ) {
    ko(error);
  }
});

describe ( 'Socket' , function () {

  describe ( 'Connect' , function () {

    describe ( 'Client' , function () {

      it ( 'should be welcome', function (done) {

        client1 = socketClient.connect(url, {
          transports: ['websocket'],
          'force new connection': true
        });

        client1.on('connect', () => done());

      });

    });

  });

  describe ( 'Identify' , function () {

    it ( 'should set synuser' , function (done) {

      User
        .findOne()
        .then(
          user => {
            try {
              const json = user.toJSON();
              client2.synuser = {
                id : json._id
              };
              done();
            }
            catch ( error ) {
              done(error);
            }
          },
          done
        );

    });

  });

  describe ( 'Methods' , function () {

    describe ( 'get top level type' , function () {

      let topLevelTypeId, topLevelType;

      it ( 'should get top level type id from config' , function(done) {

        Config.findValueByName('top level type').then(
          value => {
            topLevelTypeId = value;
            done();
          },
          done
        );

      });

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

          topLevelType.should.be.a.typeDocument({}, true);

        });

        it ( 'should be top level' , function () {

          topLevelType._id.toString().should.be.exactly(topLevelTypeId.toString());

        });

      });

    });

    describe ( 'get items' , function () {

      let expected, actual, panelItems;

      describe ( 'Get expected panel items', function () {

        let panel = {}, res;

        it ( 'should get type', function (done) {

          Type.findOne({ name : 'Test' })
            .then(
              type => {
                panel.type = type;
                done();
              },
              done
            );

        });

        it ( 'should be a type', function () {

          panel.type.should.be.a.typeDocument({ name : 'Test' });

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

          Training.find({}, { sort : { step : 1 } }).then(
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

        it ( 'should return training', function (done) {

          this.timeout(5000);

          mock(getTraining, 'get training')
            .then(
              instructions => {
                $instructions = instructions;
                done();
              },
              done
            );

        });

        it ( 'should be the same than from DB', function () {

          $instructions.should.be.an.Array()
            .and.have.length(instructions.length);

          instructions.forEach((instruction, index) => {
            $instructions[index]._id.toString().should.be.exactly(instruction._id.toString());
          });

        });

      });

    });

    describe ( 'get countries' , function () {

      let countries, $countries;

      describe ( 'Get countries from db' , function () {

        it ( 'should get countries' , function (done) {

          Country.find({}, { limit : false }).then(
            documents => {
              countries = documents;
              done();
            },
            done
          );

        });

        it ( 'should be countries', function () {

          countries.should.be.an.Array();

          countries.length.should.be.above(0);

          countries.forEach(country => country.should.be.a.country());

        });

      });

      describe ( 'get countries from socket' , function () {

        it ( 'should emit and receive' , function (done) {

          client1
            .on('OK get countries', countries => {
              $countries = countries;
              done();
            })
            .emit('get countries');

        });

        it ( 'should be an array of the same countries than from DB' , function () {

          $countries.should.be.an.Array().and.have.length(countries.length);

          countries.forEach((country, index) => {
            $countries[index]._id.should.be.exactly(country._id.toString());
          });

        });

      });

    });

    describe ( 'get user info' , function () {

      let dbUser;

      describe ( 'get user', function () {

        it ( 'should get user info' , function (done) {

          const onError = error => done(error);

          getUserInfo.apply(client2, ['get user info']);

          client2
            .on('error', onError)
            .on('OK get user info', user => {

              user.should.be.an.Object()
                .and.have.property('_id')
                .which.is.exactly(client2.synuser.id);

              client2.removeListener('error', onError);

              done();

            });

        });

      });

    });

    describe ( 'get discussion' , function () {});
    describe ( 'get education' , function () {});
    describe ( 'get employment' , function () {});
    describe ( 'get marital statuses' , function () {});
    describe ( 'get political parties' , function () {});
    describe ( 'get races' , function () {});
    describe ( 'get states' , function () {});
    describe ( 'save user image' , function () {});

  });

});
