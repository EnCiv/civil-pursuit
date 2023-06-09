'use strict';

function getLineage (userId) {
  return new Promise((ok, ko) => {
    try {
      const Item = this.constructor;

      let lineage = [];

      const _getLineage = itemId => {
        if ( itemId ) {
          Item
            .findById(itemId)
            .then(
              item => {
                try {
                  if ( ! item ) {
                    return ok(lineage);
                  }

                  item.toPanelItem(userId).then(
                    item => {
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
                }
                catch ( error ) {
                  ko(error);
                }
              },
              ko
            );
        }
        else {
          ok(lineage);
        }
      };

      _getLineage(this.parent);
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default getLineage;
