'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import isAppError           from '../.test/assertions/is-app-error';
import AppError             from '../../models/app-error';

function test () {
  const locals = {};

  return describe ( 'Models/AppError', [

    {
      'Throw error' : [
        {
          'should create a new error in DB' : (ok, ko) => {
            try {
              throwError();
            }
            catch ( error ) {
              AppError.throwError(error).then(
                error => {
                  locals.error = error;
                  ok();
                },
                ko
              );
            }
          }
        },
        {
          'should be an error' : describe.use(() => isAppError(locals.error))
        }
      ]
    }

  ]);
}

export default test;
