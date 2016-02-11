'use strict';

import Mungo                      from 'mungo';
import sequencer                  from 'sequencer';
import User                       from 'syn/../../dist/models/user';

/** <<<MD
Switching model engine from Mongoose to Mungo
===

Main difference is the presence of the `__V` attribute
 that Mungo uses in migrations.

So we'll add a `{ __V : 1 }` to all existing documents
MD ***/

class Discussion extends Mungo.Migration {

  static version = 1;

  static get schema () {
    return {
      "subject"       :   {
        "type"        :   String,
        "required"    :   true
      },
      "description"   :   {
        "type"        :   String,
        "required"    :   true
      },
      "deadline"      :   {
        "type"        :   Date,
        "required"    :   true
      },
      "starts"        :   {
        "type"        :   Date,
        "required"    :   true
      },
      "goal"          :   {
        "type"        :   Number,
        "required"    :   true
      },
      "registerd"     :   {
        "type"        :   [User],
        "default"     :   []
      }
    };
  };

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

export default Discussion;
