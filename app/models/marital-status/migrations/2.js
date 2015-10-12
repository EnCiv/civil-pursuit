'use strict';

import fixtures from '../../../../fixtures/marital-status/1.json';

class V2 {
  static do () {
    return new Promise((ok, ko) => {
      try {
        this.find({ __V : 2 })
          .then(
            statuses => {
              try {
                if ( statuses.length ) {
                  return ok();
                }
                this
                  .create(fixtures.map(status => {
                    status.__V = 2;
                    return status;
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
