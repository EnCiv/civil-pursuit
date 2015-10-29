'use strict';

import Mungo from 'mungo';
import Type from '../../type';
import fixtures from '../../../../fixtures/config/1.json';
import sequencer from '../../../lib/util/sequencer';

const collection = 'config';

class V1 {
  static schema () {
    return {
      name : {
        type : String,
        required : true,
        unique : true
      },
      value : Mungo.Mixed
    };
  }

  static do () {
    return new Promise((ok, ko) => {
      try {
        const findV1 = () => this.find({ __V : 1 }, { limit : false });

        const ensureTypeV2 = Type.migrations[2].do.bind(Type);

        const getTopLevelType = () => Type.findOne({ name : fixtures[0].value });

        const applyFixtures = type => this.create({ name :  fixtures[0].name, value : type._id });

        findV1()
          .then(documents => {
            try {
              if ( documents.length ) {
                return ok();
              }
              ensureTypeV2().then(
                () => {
                  getTopLevelType().then(
                    type => {
                      console.log({ type });
                      applyFixtures(type).then(
                        created => {
                          try {
                            Mungo.Migration
                              .create({
                                collection,
                                version : 1,
                                created : [created]
                              })
                              .then(ok, ko);
                          }
                          catch ( error ) {
                            ko(error);
                          }
                        },
                        ko
                      );
                    },
                    ko
                  );
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

export default V1;
