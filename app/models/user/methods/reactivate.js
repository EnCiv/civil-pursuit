'use strict';

import randomString from '../../../lib/util/random-string';

function reactivate () {
  return new Promise((ok, ko) => {
    try {
      Promise.all([randomString(8), randomString(8)])
        .then(
          results => {
            try {
              const [ activation_key, activation_token ] = results;

              this.set('activation_key', activation_key);
              this.set('activation_token', activation_token);

              ok();
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

export default reactivate;
