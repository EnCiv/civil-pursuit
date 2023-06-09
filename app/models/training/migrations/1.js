'use strict';

import Mungo from 'mungo';
import sequencer from 'promise-sequencer';

/** <<<MD
Switching model engine from Mongoose to Mungo
===

Main difference is the presence of the `__V` attribute
 that Mungo uses in migrations.

So we'll add a `{ __V : 1 }` to all existing documents
MD ***/

class Training extends Mungo.Migration {

  static version = 1;

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

      // find all untagged documents

      ()    =>  this.find({ __V : { $exists : false } }).limit(false),

      // save documents in migrations for revert

      docs  =>  new Promise((ok, ko) => {
        Promise.all(docs.map(doc => super.revert(
          { unset : { fields : ['__V'], get : { _id : doc._id } } }
        ))).then(() => ok(docs), ko);
      }),

      // tag documents

      docs  =>  Promise.all(docs.map(doc => doc.set('__V', 1).save()))

    ]);
  }
}

export default Training;
