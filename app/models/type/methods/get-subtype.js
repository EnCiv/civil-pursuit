'use strict';

function getSubtype () {
  return new Promise((ok, ko) => {
    try {
      this.constructor
        .find({ parent : this.type })
        .then(
          types => {
            try {
              if ( ! types.length ) {
                return ok(null);
              }
              const promises = types.map(type => type.isHarmony());
              Promise
                .all(promises)
                .then(
                  results => {
                    try {
                      const subtype = results.reduce(
                        (subtype, isHarmony, index) => {
                          if ( ! isHarmony ) {
                            subtype = types[index];
                          }
                          return subtype;
                        }, null);

                      ok(subtype);
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
          },
          ko);
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default getSubtype;
