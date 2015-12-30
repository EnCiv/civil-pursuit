'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import isAppError           from 'syn/../../dist/test/assertions/is-app-error';
import AppError             from 'syn/../../dist/models/app-error';

function test () {
  const locals = {};

  return describe ( 'Models/AppError', it => {

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

  });
}

export default test;
