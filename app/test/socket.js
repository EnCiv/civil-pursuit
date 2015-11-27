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
    }

  ]);
}

export default test;
