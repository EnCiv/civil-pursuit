'use strict';

import should               from 'should';
import describe             from '../../lib/util/describe';
import Type                 from '../../models/type';

function test () {
  const locals = {};

  return describe ( 'Models/Type', [

    {
      'Create' : [

        {
          'should query DB and throw an error' : (ok, ko) => {

            Type
              .create({})
              .then(
                user => {
                  ko(new Error('Should have thrown error'));
                },
                error => {
                  locals.dbError = error;
                  ok();
                }
              );

          }
        }

      ]
    }

  ]);
}

export default test;
