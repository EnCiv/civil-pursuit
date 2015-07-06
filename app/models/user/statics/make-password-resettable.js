'use strict';

import { Domain } from 'domain';
import randomString from '../../../lib/util/random-string';

function makePasswordResettable (email) {
  return new Promise((ok, ko) => {

    let promises = [
      new Promise((ok, ko) => {
        randomString(8).then(ok, ko);
      }),

      new Promise((ok, ko) => {
        randomString(8).then(ok, ko);
      })
    ];

    Promise.all(promises)
      .then(
        results => {
          let [ key, token ] = results;

          let d = new Domain().on('error', error);

          this
            .update(
              { email: email },

              {
                activation_key    :   key,
                activation_token  :   token
              }
            )
            .exec(d.intercept(number => {
              if ( ! number ) {
                let error = new Error('No such email');

                error.code = 'DOCUMENT_NOT_FOUND';

                throw error;
              }

              ok({ key: results.key, token: results.token });
            }));
        },
        ko
      );

  });
}

export default makePasswordResettable;
