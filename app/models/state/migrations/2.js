'use strict';

import fixtures from '../../../../fixtures/state/1.json';

class V2 {
  static do () {
    return new Promise((ok, ko) => {
      try {
        this.find({ __V : 2 })
          .then(
            states => {
              try {
                if ( states.length ) {
                  return ok();
                }
                this
                  .create(fixtures.map(state => {
                    state.__V = 2;
                    return state;
                  }))
                  .then(
                    ok,
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

  static undo () {
    return this.remove({ __V : 2 });
  }
}

export default V2;
