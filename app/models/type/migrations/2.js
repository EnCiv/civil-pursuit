'use strict';

import config         from    '../../../../secret.json';
import Mungo           from 'mungo';

const collection = 'types';

class V2 {
  static do () {
    return new Promise((ok, ko) => {
      try {
        this
          .findOne({ name : config['top level item'] })
          .then(
            type => {
              try {
                if ( type ) {
                  return ok();
                }
                this
                  .create({ name : config['top level item'] })
                  .then(
                    created => {
                      try {
                        Mungo.Migration
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
    return Mungo.Migration.undo(this, 2, collection);
  }
}

export default V2;
