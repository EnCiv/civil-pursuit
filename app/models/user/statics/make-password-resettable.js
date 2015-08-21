'use strict';

import randomString from '../../../lib/util/random-string';

function makePasswordResettable (email) {
  return new Promise((ok, ko) => {
    try {
      Promise.all([randomString(8), randomString(8)])
        .then(
          results => {
            try {
              let [ key, token ] = results;

              this
                .update({ email }, {
                  activation_key    :   key,
                  activation_token  :   token
                })
                .exec()
                .then(
                  number => {
                    try {
                      if ( ! number ) {
                        let error = new Error('No such email');

                        error.code = 'DOCUMENT_NOT_FOUND';

                        throw error;
                      }

                      ok({ key, token });
                    }
                    catch ( error ) {
                      ko(error);
                    }
                  },
                  ko
                );
            }
            catch ( error ) {
              ko(error);
            }
          },
          ko
        );
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default makePasswordResettable;
