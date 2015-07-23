'use strict';

function incrementView (itemId) {
  return new Promise((ok, ko) => {
    try {
      this
        .findByIdAndUpdate(
          itemId,
          { $inc: { "views": 1 } },
          (error, item) => {
            try {
              if ( error ) {
                throw error;
              }
              if ( ! item ) {
                throw new Error('Item not found: ' + itemId);
              }
              ok(item);
            }
            catch ( error ) {
              ko(error);
            }
          });
    }
    catch ( error ) {
      ko(error); 
    }
  });
}

export default incrementView;
