'use strict';

import mongodb from 'mongodb';
import Mung from '../../../lib/mung';

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
                                    .create(configs[0].race.map(race => {
                                      race.__V = 2;

                                      return race;
                                    }), { create : true })
                                    .then(ok, ko);
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
    return this.remove({ __V : 2 });
  }
}

export default V2;
