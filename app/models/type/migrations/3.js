'use strict';

import Mungo from 'mungo';

const collection = 'types';

class V3 {
  static schema () {
    return {
      "name"        :     {
        type        :     String,
        unique      :     true,
        required    :     true
      },

      "harmony"     :     {
        type        :     [Type],
        default     :     []
      },

      "parent"      :     Type
    };
  }

  static do () {
    return new Promise((ok, ko) => {
      try {
        this.find({ __V : 3 }, { limit : false }).then(
          documents => {
            try {
              if ( documents.length ) {
                return ok();
              }
              this.find().then(
                types => {
                  try {
                    const harmony = types
                      .filter(type => type.harmony && type.harmony.length )
                      .reduce((harmonies, type) => {
                        harmonies.push(...(type.harmony));
                        return harmonies;
                      }, []);

                    const parents = {};

                    harmony.forEach(harmony => {
                      const type = types.reduce((match, type) => {
                        if ( type.harmony.some($harmony => $harmony.equals(harmony)) ) {
                          match = type;
                        }
                        return match;
                      }, null);

                      parents[harmony] = type._id;
                    });

                    this.updateByIds(harmony, { $unset : 'parent' })
                      .then(
                        updated => {
                          try {
                            const undo = harmony.map(type => ({
                              _id : type,
                              set : { parent : parents[type] }
                            }));

                            Mungo.Migration
                              .create({
                                collection,
                                version : 3,
                                undo
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
    return Mungo.Migration.undo(this, 3, collection);
  }
}

export default V3;
