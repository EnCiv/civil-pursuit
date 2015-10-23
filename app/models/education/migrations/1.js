'use strict';

import mongodb from 'mongodb';
import Mungo from 'mungo';

const collection = 'educations';

class V2 {
  static do () {
    return new Promise((ok, ko) => {
      try {
        this.count().then(
          count => {
            try {
              if ( count ) {
                return ok();
              }

              const { db } = Mungo.connections[0];

              db.collections().then(
                collections => {
                  try {
                    if ( collections.some(collection =>
                      collection.s.namespace.split(/\./)[1] === 'configs'
                    )) {
                      db.collection('configs')
                        .find()
                        .toArray()
                        .then(
                          configs => {
                            try {
                              this
                                .create(configs[0].education, { create : true })
                                .then(
                                  created => {
                                    try {
                                      Mungo.Migration
                                        .create({
                                          collection,
                                          version : 1,
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
                    else {
                      ok();
                    }
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
    return Mungo.Migration.undo(this, 1, collection);
  }
}

export default V2;
