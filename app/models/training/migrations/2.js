'use strict';

import fixtures from 'syn/../../fixtures/training/1.json';
import Mungo from 'mungo';
import sequencer from 'sequencer';

/** <<<MD
Import data from fixtures to DB
===

    fixtures = [{ name : String }]

Insert `fixtures` into model's collection
MD ***/

class Training extends Mungo.Migration {

  static version = 2

  static get schema () {
    return {
      element           :   {
        type            :   String,
        required        :   true
      },
      step              :   {
        type            :   Number,
        required        :   true
      },
      title             :   {
        type            :   String,
        required        :   true
      },
      description       :   {
        type            :   String,
        required        :   true
      },
      in                :   Boolean,
      click             :   String,
      wait              :   {
        type            :   Mungo.Mixed,
        validate        :   value => {
          const validated = Mungo.validate(value, Number);

          if ( validated ) {
            return true;
          }

          return Mungo.validate(value, String);
        }
      },
      listen            :   String
    };
  }

  static do () {
    return sequencer([

      () => this.count(),

      count => new Promise((ok, ko) => {
        if ( count ) {
          return ok();
        }

        sequencer
          ([

            () => this.create(...fixtures),

            docs => Promise.all(docs.map(doc =>
              super.revert({ remove : { _id : doc._id } })
            ))

          ])

          .then(ok, ko);
      })

    ]);
  }
}

export default Training;
