'use strict';

import fixtures from '../../../../fixtures/type/4.json';
import harmonies from '../../../../fixtures/type/5.json';
import Mungo from 'mungo';
import Type from '../';

const collection = 'types';

class V4 {
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
        this.findOne({ name : 'Issue' })
          .then(
            issue => {
              try {
                if ( issue.harmony.length ) {
                  return ok();
                }

                let added = false;

                Promise
                  .all(['Why', 'Why not'].map(split => new Promise((ok, ko) => {
                    this.findOne({ name : split }).then(
                      harmony => {
                        try {
                          if ( ! harmony ) {
                            this.create({ name : split }).then(
                              harmony => {
                                try {
                                  added = true;
                                  issue
                                    .push('harmony', harmony)
                                    .save()
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
                            issue
                              .push('harmony', harmony)
                              .save()
                              .then(ok, ko);
                          }
                        }
                        catch ( error ) {
                          ko(error);
                        }
                      },
                      ko
                    );
                  })))
                    .then(
                      () => {
                        try {
                          if  ( ! added ) {
                            return ok();
                          }
                          Mungo.Migration
                            .create({
                              collection,
                              version : 4,
                              undo : [{
                                _id : issue._id,
                                set : { harmony : [] }
                              }]
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
    return Mungo.Migration.undo(this, 4, collection);
  }
}

export default V4;
