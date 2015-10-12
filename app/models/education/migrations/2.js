'use strict';

import fixtures from '../../../../fixtures/education/1.json';

class V2 {
  static do () {
    return new Promise((ok, ko) => {
      try {
        this.find({ __V : 2 })
          .then(
            educations => {
              try {
                if ( educations.length ) {
                  return ok();
                }
                this
                  .create(fixtures.map(education => {
                    education.__V = 2;
                    return education;
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
