'use strict';

function getOpposite () {
  return new Promise((ok, ko) => {
    try {
      let TypeModel = this.constructor;
      console.log('Check if type is harmony', this.name);
      this
        .isHarmony()
        .then(
          yes => {
            try {
              console.log('Type is harmony?', yes);
              if ( ! yes ) {
                throw new Error('Is not harmony');
              }
              TypeModel
                .findById(this.parent)
                .exec()
                .then(
                  parent => {
                    try {
                      if ( ! parent ) {
                        throw new Error('Harmony parent not found');
                      }

                      let opposite = parent.harmony.filter(
                        type => ! type.equals(this._id)
                      );
                      TypeModel
                        .findById(opposite)
                        .exec()
                        .then(ok, ko);
                    }
                    catch ( error ) {
                      ko(error);
                    }
                  },
                  ko
                );
            }
            catch ( error ) {
              ko
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
