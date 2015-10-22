'use strict';

import fixtures from '../../../../fixtures/user/1.json';
import Mung from 'mung';

const collection = 'users';

class V2 {
  static do () {
    return new Promise((ok, ko) => {
      try {
        this
          .findOne({ email : fixtures[0].email })
          .then(
            user => {
              try {
                if ( user ) {
                  return ok();
                }
                this
                  .create(fixtures[0])
                  .then(
                    created => {
                      try {
                        Mung.Migration
                          .create({
                            collection,
                            version : 2,
                            created : [created._id]
                          })
                          .then(
                            () => ok(created),
                            ko
                          );
                      }
                      catch ( error ) {
                        ko(error);
                      }
                    },
                    error => {
                      try {
                        if ( error.code === 11000 ) {
                          // means item has already called this
                          ok();
                        }
                        else {
                          ko(error);
                        }
                      }
                      catch ( error ) {
                        ko(error);
                      }
                    }
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
