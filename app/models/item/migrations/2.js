'use strict';

import config         from    '../../../../secret.json';
import Type           from    '../../type';
import User           from    '../../user';
import fixtures       from '../../../../fixtures/item/1.json';
import systemUser     from '../../../../fixtures/user/1.json';
import Mung           from 'mung';

const collection = 'items';

class V2 {
  static do () {
    return new Promise((ok, ko) => {
      try {
        Promise
          .all([
            User.migrations[2].do.apply(User),
            Type.migrations[2].do.apply(Type)
          ])
          .then(
            results => {
              try {
                const intro = fixtures[0];
                [ intro.user, intro.type ] = results;

                const promises = [];

                if ( ! intro.user ) {
                  promises.push(User.findOne({ email : systemUser[0].email }))
                }

                if ( ! intro.type ) {
                  promises.push(Type.findOne({ name : config['top level item']}));
                }

                Promise
                  .all(promises)
                  .then(
                    results => {
                      try {
                        results.forEach(result => {
                          if ( result instanceof User ) {
                            intro.user = result;
                          }

                          if ( result instanceof Type ) {
                            intro.type = result;
                          }
                        });

                        this
                          .create(intro)
                          .then(
                            created => {
                              try {
                                Mung.Migration
                                  .create({
                                    collection,
                                    version : 2,
                                    created : [created._id]
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
    return Mung.Migration.undo(this, 2, collection);
  }
}

export default V2;
