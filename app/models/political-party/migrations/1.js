'use strict';

import mongodb from 'mongodb';
import Mung from '../../../lib/mung';

const collection = 'political_parties';

class V2 {
  static do () {
    return new Promise((ok, ko) => {
      try {

        this
          .count()
          .then(
            count => {
              try {
                if ( count ) {
                  return ok();
                }

                const { db } = Mung.connections[0];

                db
                  .collections()
                  .then(
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
                                    .create(configs[0].party, { create : true })
                                    .then(
                                      created => {
                                        try {
                                          Mung.Migration
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
    return Mung.Migration.undo(this, 1, collection);
  }
}

export default V2;
