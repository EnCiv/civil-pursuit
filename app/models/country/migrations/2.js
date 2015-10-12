'use strict';

import fixtures from '../../../../fixtures/country/1.json';

class V2 {
  static do () {
    return new Promise((ok, ko) => {
      try {
        this.find({ __V : 2 })
          .then(
            countries => {
              try {
                if ( countries.length ) {
                  return ok();
                }
                this
                  .create(fixtures.map(country => {
                    country.__V = 2;
                    return country;
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
