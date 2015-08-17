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

      // this
      //   .findByIdAndUpdate(
      //     itemId,
      //     { $inc: { "views": 1 } },
      //     (error, item) => {
      //       console.log('------------------------', item)
      //       try {
      //         if ( error ) {
      //           throw error;
      //         }
      //         if ( ! item ) {
      //           throw new Error('Item not found: ' + itemId);
      //         }
      //         ok(item);
      //       }
      //       catch ( error ) {
      //         ko(error);
      //       }
      //     });
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default incrementView;
