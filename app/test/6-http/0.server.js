'use strict';

import Mungo                  from 'mungo';
import should                 from 'should';
import superagent             from 'superagent';
import describe               from 'redtea';
import Server                 from '../../server';
import Type                   from '../../models/type';
import Item                   from '../../models/item';
import Config                 from '../../models/config';
import isType                 from '../../lib/assertions/is-type';
import isItem                 from '../../lib/assertions/is-item';
import isPanelItem            from '../../lib/assertions/is-panel-item';

process.env.PORT = 13012;

function test (props) {
  props.port = process.env.PORT;

  const locals = {};

  return describe ( 'HTTP Server', [
    {
      'Start' : [
        {
          'Intro' : [
            {
              'it should get intro type from DB' : (ok, ko) => {
                Type
                  .findOne({ name : 'Intro' })
                  .then(
                    document => {
                      locals.introType = document;
                      ok();
                    },
                    ko
                  );
              }
            },
            {
              'it should get intro item from DB' : (ok, ko) => {
                Item
                  .findOne({ type : locals.introType })
                  .then(
                    document => {
                      locals.intro = document;
                      ok();
                    },
                    ko
                  );
              }
            },
            {
              'it should panelify' : (ok, ko) => {
                locals.intro
                  .toPanelItem()
                  .then(
                    item => {
                      locals.intro = item;
                      ok();
                    },
                    ko
                  );
              }
            }
          ]

        },
        {
          'HTTP Server' : [{

            'it should start' : (ok, ko) => {
              locals.server = new Server({ intro : locals.intro });

              locals.server
                .on('error', ko)
                .on('listening', ok);
            }

          }]
        }
      ]
    }
  ]);
}

export default test;
