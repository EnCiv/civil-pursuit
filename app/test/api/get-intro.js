'use strict';

import getIntro from 'syn/api/get-intro';

function getIntroTest () {
  return new Promise((ok, ko) => {
    try {

      let state = null;

      let event = 'get intro';

      let mock = {

        error (error) {
          ko(error);
          state(false);
        },

        ok (event, intro) {
          state = true;
          ok(intro);
        }

      };

      getIntro.apply(mock, [event]);

      setTimeout(() => {
        if ( state === null ) {
          ko(new Error('Script timed out'));
        }
      }, 2500);
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default getIntroTest;
