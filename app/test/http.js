'use strict';

import Mungo                  from 'mungo';
import should                 from 'should';
import superagent             from 'superagent';
import describe               from '../lib/util/describe';
import Server                 from '../server';
import Type                   from '../models/type';
import Item                   from '../models/item';
import Config                 from '../models/config';

function test () {
  const locals = {};

  return describe ( 'HTTP', [

    {
      'Start' : [

        {
          'Intro' : [

            {
              'it should get intro from DB' : (ok, ko) => {

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
            }

          ]
        }

      ]
    }

  ]);
}

export default test;
