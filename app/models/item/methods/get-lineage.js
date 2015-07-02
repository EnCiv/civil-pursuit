'use strict';

function getLineage () {
  return new Promise((ok, ko) => {
    let ItemModel = this.constructor;

    let lineage = [];

    let _getLineage = (itemId) => {
      ItemModel
        .findById(itemId)
        .exec()
        .then(
          item => {
            if ( ! item ) {
              return ok(lineage);
            }
            lineage.push(item);
            if ( item.parent ) {
              _getLineage(item.parent);
            }

            else {
              lineage.reverse();
              ok(lineage);
            }
          },
          ko
        );
    };

    getLineage(this.parent);
  });
}

export default getLineage;
