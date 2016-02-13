'use strict';

import Mungo                from 'mungo';
import sequencer            from 'promise-sequencer';
import types                from 'syn/../../fixtures/type/1.json';


/** Create default types
===

- Use fixtures `types` to create all the types
*/

class Type extends Mungo.Migration {

  static version = 2;

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
    return Promise.all(types.map(type => sequencer([

      // see if type already inserted

      () => this.count({ name : type.name }),

      count => new Promise((ok, ko) => {
        if ( count ) {
          return ok();
        }

        sequencer(
          () => this.create({ name : type.name }),

          created => this.revert({ remove : { _id : created._id } })
        )
        .then(ok, ko);
      })

    ])));
  }
}

export default Type;
