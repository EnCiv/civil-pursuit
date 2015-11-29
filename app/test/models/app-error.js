'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from '../../lib/util/describe';
import isAppError           from '../../lib/assertions/app-error';
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
          'should be an error' : (ok, ko) => {
            locals.error.should.be.an.appError();
            ok();
          }
        }
      ]
    }

  ]);
}

export default test;
