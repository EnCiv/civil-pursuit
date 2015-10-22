'use strict';

import fixtures from '../../../../fixtures/marital-status/1.json';
import Mung from 'mung';

const collection = 'marital_statuses';

class V2 {
  static do () {
    return new Promise((ok, ko) => {
      try {
        this.find({ __V : 2 }, { limit : false })
          .then(
            documents => {
              try {
                if ( documents.length ) {
                  return ok();
                }
                this
                  .create(fixtures)
                  .then(
                    created => {
                      try {
                        Mung.Migration
                          .create({
                            collection,
                            version : 2,
                            created : created.map(doc => doc._id)
                          })
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

  static undo () {
    return Mung.Migration.undo(this, 2, collection);
  }
}

export default V2;
