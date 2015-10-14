'use strict';

import API                        from '../../app/api';
import { EventEmitter }           from 'events';
import should                     from 'should';
import fs                         from 'fs';
import path                       from 'path';
import S                          from 'string';
import socketClient               from 'socket.io-client';

const http = new EventEmitter();

let server;

describe ( 'Socket' , function () {

  describe ( 'Start' , function () {

    server = new API(http);

    it ( 'should be an event emitter', function () {

      server.should.be.an.instanceof(EventEmitter);

    });

    it ( 'should have a property server' , function (done) {

      process.nextTick(() => {

        try {
          server.should.have.property('server');
          done();
        }
        catch ( error ) {
          done(error);
        }

      });

    });

    describe ( 'Server' , function () {

      it ( 'should be an instance of the HTTP Server' , function () {

        server.server.should.be.exactly(http);

      });

    });

    it ( 'should have a property users' , function (done) {

      process.nextTick(() => {

        try {
          server.should.have.property('users');
          done();
        }
        catch ( error ) {
          done(error);
        }

      });

    });

    describe ( 'Users' , function () {

      it ( 'should be an array' , function () {

        server.users.should.be.an.Array;

      });

    });

    it ( 'should have a property handlers' , function (done) {

      process.nextTick(() => {

        try {
          server.should.have.property('handlers');
          done();
        }
        catch ( error ) {
          done(error);
        }

      });

    });

    describe ( 'Handlers' , function () {

      it ( 'should be an array' , function () {

        server.handlers.should.be.an.Array;

        console.log(server.handlers);

      });

      describe ( 'should contain all the api files' , function () {

        let handlers = [];

        it ( 'should get API files' , function (done) {

          try {
            fs.readdir(path.resolve(__dirname, '../../app/api'), (error, files) => {
              try {
                if ( error ) {
                  throw error;
                }

                files.forEach(file => {
                  const name      =   S(file.replace(/\.js$/, ''))
                    .humanize()
                    .s
                    .toLowerCase();

                  const handler   =   require('../../app/api/' + file);

                  handlers[name] = handler;
                });

                done();
              }
              catch ( error ) {
                done(error);
              }
            });
          }
          catch ( error ) {
            done(error);
          }

        });

        it ( 'should have the same API methods than server' , function () {

          handlers.forEach((handler, index) => {
            handler.should.be.exactly(server.handlers[index]);
          });

        });

      });

    });

  });

  describe ( 'Connect' , function () {

    describe ( 'Client' , function () {

      let client1;

    });

  });

});
