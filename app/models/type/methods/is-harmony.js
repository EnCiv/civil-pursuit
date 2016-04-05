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
        .then(
          parent => {
            try {
              if ( parent.harmony ) {
                if (! parent.harmony.length ) {
                  return ok(false);
                } else {
                  return ok(false);
                }
              ok(parent.harmony.map(id => id.toString()).indexOf(this._id.toString()) > -1);
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
