'use strict';

function incrementView (itemId) {
  return new Promise((ok, ko) => {
    try {

      this
        .findById(itemId)
        .exec()
        .then(
          item => {
            try {
              if ( ! item ) {
                throw new Error('No such item');
              }

              item.views ++;

              item.save(error => {
                if ( error ) {
                  ko(error);
                }
                ok(item);
              })
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

export default incrementView;
