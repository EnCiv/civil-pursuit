'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import testWrapper          from 'syn/../../dist/lib/app/test-wrapper';
import isAppError           from 'syn/../../dist/test/is/app-error';
import AppError             from 'syn/../../dist/models/app-error';

function test () {
  const locals = {};

  return testWrapper('Models -> AppError -> Throw',
    {
      mongodb : true,
    },
    wrappers => it => {

      it('Throw error', it => {

        it('should create a new error in DB', () => new Promise((ok, ko) => {
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
          })
        );

        it('should be an error', describe.use(() => isAppError(locals.error)));

      });

    }
  );
}

export default test;
