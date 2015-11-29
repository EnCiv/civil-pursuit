'use strict';

import describe                   from '../lib/util/describe';
import { EventEmitter }           from 'events';
import fs                         from 'fs';
import path                       from 'path';
import should                     from 'should';
import S                          from 'string';
import Mungo                      from 'mungo';
import socketClient               from 'socket.io-client';
import config                     from '../../secret.json';
import publicConfig               from '../../public.json';
import API                        from '../api';
import Item                       from '../models/item';
import Type                       from '../models/type';
import User                       from '../models/user';
import { Popularity }             from '../models/item/methods/get-popularity';
import Training                   from '../models/training';
import isInstruction              from '../lib/assertions/training';
import isCountry                  from '../lib/assertions/country';
import getUserInfo                from '../api/get-user-info';
import getTraining                from '../api/get-training';
import Country                    from '../models/country';
import Config                     from '../models/config';

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


function test () {
  const locals = {
    url : 'http://localhost:13012'
  };

  return describe ( 'Sockets', [

    {
      'Connect' : [

        {
          'Socket Client' : [

            {
              'it should connect' : (ok, ko) => {

                locals.client1 = socketClient.connect(locals.url, {
                  transports: ['websocket'],
                  'force new connection': true
                });

                locals.client1
                  .on('error', ko)
                  .on('connect', ok);

              }
            }

          ]
        }

      ]
    },
    {
      'Identify' : [
        {
          'should set synuser' : (ok, ko) => {
            User
              .findOne()
              .then(
                user => {
                  try {
                    const json = user.toJSON();
                    client2.synuser = {
                      id : json._id
                    };
                    ok();
                  }
                  catch ( error ) {
                    ko(error);
                  }
                },
                ko
              );
          }
        }
      ]
    }

  ]);
}

export default test;
