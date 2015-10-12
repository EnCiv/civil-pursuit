'use strict';

import fixtures from '../../../../fixtures/political-party/1.json';

class V2 {
  static do () {
    return new Promise((ok, ko) => {
      try {
        this.find({ __V : 2 })
          .then(
            parties => {
              try {
                if ( parties.length ) {
                  return ok();
                }
                this
                  .create(fixtures.map(party => {
                    party.__V = 2;
                    return party;
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
