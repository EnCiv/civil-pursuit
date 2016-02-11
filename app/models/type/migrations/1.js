'use strict';

import Mungo              from 'mungo';
import sequencer          from 'sequencer';

/** Insert a __V attribute to all documents that have not one
===
*/

class Type extends Mungo.Migration {

  static version = 1;

  static get schema () {
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

export default Type;
