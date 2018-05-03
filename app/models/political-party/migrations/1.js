'use strict';

import Mungo from 'mungo';
import sequencer from 'promise-sequencer';

/** <<<MD
Import data from Config
===

This collection used to be a subdocument of the Config model
 --it now has its own model.

- We count documents from Model if any
- If count is above 0, exit
- If count is 0:
  - Config used to be a collection made of one big single document.
    Now each property of this big document has its own document.
    Plus some properties get moved to their own collection for maintability.
    (This is the case of the current model)

    So, in order to fetch data from old config's big document,
     we'll bypass Mungo and use directly MongoDB node's native driver.
    We look for a collection named `configs.
    (When Config migrated from a big document to a bunch of small ones,
     it also changed collection name from `configs` to `config`)`.

    We then pull data from `configs` and put relevant one to current model.
MD ***/

class PoliticalParty extends Mungo.Migration {
  static version = 1;

  static collection = 'political_party';

  static schema = { name : String };

  static do () {
    return sequencer([

      ()      =>    this.count(),

      count   =>    new Promise((ok, ko) => {

        if ( count ) {
          return ok();
        }

        const { db } = Mungo.connections[0];

        sequencer([

          () => db.collections(),

          collections => new Promise((ok, ko) => {

            const collectionExists = collections.some(collection =>
              collection.s.namespace.split(/\./)[1] === 'configs'
            );

            if ( ! collectionExists ) {
              return ok();
            }

            const configs = db.collection('configs');

            sequencer([

              ()        =>  configs.find().limit(1).toArray(),

              config    =>  this.create(config.party),

              doc       =>  this.revert({ remove : { _id : doc._id } })

            ])
            .then(ok, ko);

          })

        ])

          .then(ok, ko);

      })

    ]);

  }
}

export default PoliticalParty;
