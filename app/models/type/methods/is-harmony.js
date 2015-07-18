'use strict';

function isHarmony () {
  return new Promise((ok, ko) => {
    try {
      if ( ! this.parent ) {
        return ok(false);
      }

      let TypeModel = this.constructor;

      TypeModel
        .findById(this.parent)
        .exec()
        .then(
          parent => {
            try {
              if ( ! parent.harmony.length ) {
                return ok(false);
              }
              ok(parent.harmony.indexOf(this._id) > -1);
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

export default isHarmony;
