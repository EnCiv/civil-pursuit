'use strict';

function getLineage () {
  return new Promise((ok, ko) => {
    try {
      const Item = this.constructor;

      let lineage = [];

      const _getLineage = itemId => {
        ItemModel
          .findById(itemId)
          .then(
            item => {
              try {
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
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      };

      _getLineage(this.parent);
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default getLineage;
