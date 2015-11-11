'use strict';

import collectionId       from '../../../lib/app/collection-id';
import Mungo              from 'mungo';

const collection = 'types';

class V5 {
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

      "parent"      :     Type,

      "id"          :     String
    };
  }

  static do () {
    return new Promise((ok, ko) => {
      try {
        this.find({ id : { $exists : false }, __V : { $lt : 5 } }, { limit : false })
          .then(
            documents => {
              try {
                if ( ! documents.length ) {
                  return ok();
                }

                const undo = [];
                const promises = [];

                documents.forEach(document => {

                  undo.push({ _id : document._id, unset : ['id'] });

                  promises.push(new Promise((ok, ko) => {
                    collectionId(this).then(
                      id => {
                        document.set('id', id).save().then(ok, ko);
                      },
                      ko
                    );
                  }));

                  Promise.all(promises).then(
                    () => {
                      Mungo.Migration
                        .create({
                          collection,
                          version : 5,
                          undo
                        })
                        .then(ok, ko);
                    },
                    ko
                  );

                });
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
    return Mungo.Migration.undo(this, 5, collection);
  }
}

export default V5;
