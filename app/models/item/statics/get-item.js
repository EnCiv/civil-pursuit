'use strict';

function getItemById (id) {
  return new Promise((ok, ko) => {
    let ItemModel = this;

    ItemModel
      .findOne({ id : id })
      .exec()
      .then(
        item => {
          if ( ! item ) {
            return ok();
          }

          item
            .toPanelItem()
            .then(
              ok(item),
              ko
            );
        }
      );
  });
}

export default getItemById;
