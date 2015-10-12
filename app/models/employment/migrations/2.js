'use strict';

import fixtures from '../../../../fixtures/employment/1.json';

class V2 {
  static do () {
    return new Promise((ok, ko) => {
      try {
        this.find({ __V : 2 })
          .then(
            employments => {
              try {
                if ( employments.length ) {
                  return ok();
                }
                this
                  .create(fixtures.map(employment => {
                    employment.__V = 2;
                    return employment;
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
