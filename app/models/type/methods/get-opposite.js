'use strict';

function getOpposite () {
  return new Promise((ok, ko) => {
    try {
      this.isHarmony().then(
        isHarmony => {
          try {
            if ( ! isHarmony ) {
              return ko(new Error('Get not get opposite of a type which is not part of an harmony'));
            }
            this.constructor.findById(this.parent).then(
              parent => {
                try {
                  if ( ! parent ) {
                    return ko(new Error('Could not find parent of harmony'));
                  }
                  const opposite = parent.harmony
                    .filter(_id => ! _id.equals(this._id))
                    [0];
                  this.constructor.findById(opposite).then(ok, ko);
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
        ko
      );
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default getOpposite;
