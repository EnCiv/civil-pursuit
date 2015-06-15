'use strict';

import mongoose     from    'mongoose';
import TypeModel    from    'syn/models/Type';
import ItemModel    from    'syn/models/Item';
import mongodb      from    'mongodb';

function v2 () {
  return new Promise((ok, ko) => {
    console.log('v2');

    // mongoose.connect(process.env.MONGOHQ_URL);

    // let MongoClient = mongodb.MongoClient;

    let _Types = [
      { name: 'Intro' },
      { name: 'Topic' },
      { name: 'Problem',  parent: 'Topic',    harmony: ['Agree', 'Disagree'] },
      { name: 'Solution', parent: 'Problem',  harmony: ['Pro', 'Con'] },
      { name: 'Pro',      parent: 'Solution' },
      { name: 'Con',      parent: 'Solution' },
      { name: 'Agree',    parent: 'Problem' },
      { name: 'Disagree', parent: 'Problem' },
    ];

    // Name

    let promisesName = _Types.map(t => new Promise((ok, ko) => {
      TypeModel
        .findOne({ name : t.name })
        .exec()
        .then(
          type => {
            if ( type ) {
              return ok();
            }

            TypeModel
              .create({ name : t.name })
              .then(ok, ko);
          },
          ko
        );
    }));

    console.log('v2', 'Insert types just with name if not exist');

    Promise.all(promisesName).then(
      () => {
        // Parent

        console.log('v2', 'Insert types just with parent if not exist');

        let promisesParent = _Types
          .filter(t => t.parent)
          .map(t => new Promise((ok, ko) => {

            TypeModel
              .findOne({ name : t.name })
              .exec()
              .then(
                T => {
                  if ( T.parent ) {
                    return ok();
                  }

                  TypeModel
                    .findOne({ name : t.parent })
                    .exec()
                    .then(
                      parent => {
                        if ( ! parent ) {
                          return ko();
                        }

                        T.parent = parent;
                        T.save(error => {
                          if ( error ) {
                            return ko(error);
                          }
                          ok();
                        });

                      },
                      ko
                    );
                },
                ko
              );

          }));

        Promise.all(promisesParent).then(
          () => {
            // Harmony

            console.log('v2', 'Insert types just with harmony if not exist');

            let promisesHarmony = _Types
              .filter(t => t.harmony)
              .map(t => new Promise((ok, ko) => {
                  
                TypeModel
                  .findOne({ name : t.name })
                  .exec()
                  .then(
                    T => {

                      if ( T.harmony.length ) {
                        return ok();
                      }

                      TypeModel
                        .find({ name : { $in : [t.harmony[0], t.harmony[1]] } })
                        .exec()
                        .then(
                          harmony => {

                            if ( ! harmony.length ) {
                              return ko();
                            }

                            T.harmony = harmony;

                            T.save(error => {
                              if ( error ) {
                                return ko(error);
                              }
                              else {
                                ok();
                              }
                            });

                          },
                          ko
                        );
                    },
                    ko
                  );
              }));
          
            Promise.all(promisesHarmony).then(() => {
              console.log('v2', 'Done', ok); ok() }, ko);
          },
          ko
        );
      },
      ko
    );

  });
}

export default v2;

// v2();
