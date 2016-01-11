'use strict';

import collectionId from 'syn/../../dist/lib/app/collection-id';

function generateId (doc) {
  return new Promise((ok, ko) => {
    try {
      collectionId(this)
        .then(
          id => {
            doc.set('id', id);
            ok();
          },
          ko
        );
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default generateId;
