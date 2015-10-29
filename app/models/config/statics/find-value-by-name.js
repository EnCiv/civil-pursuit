'use strict';

function findValueByName (name) {
  return new Promise((ok, ko) => {
    try {
      this.findOne({ name }).then(
        config => {
          try {
            if ( ! config ) {
              throw new Error(`No such config by the name of ${name}`);
            }
            ok(config.value);
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

export default findValueByName;
