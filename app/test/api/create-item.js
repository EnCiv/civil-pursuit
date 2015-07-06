'use strict';

import createItem from '../../api/create-item';

class CreateItemTest {

  static main () {
    return Promise
      .all([
        CreateItemTest.missingSubjectThrowsError()
      ]);
  }

  static missingSubjectThrowsError () {
    return new Promise((ok, ko) => {
      try {
        let state = null;

        let event = 'create item';

        let mock = {

          error (error) {
            ok(error);
            state = true;
          },

          ok (event) {
            state = false;
            ko(new Error('Script did not throw'));
          }

        };

        createItem.apply(mock, [event, {}]);

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

}

export default CreateItemTest.main;
