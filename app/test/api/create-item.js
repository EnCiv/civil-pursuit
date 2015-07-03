'use strict';

import createItem from 'syn/api/createItem';

function createItemTest () {
  return new Promise((ok, ko) => {
    try {

      let state = null;

      let event = 'create item';

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

export default createItemTest;
