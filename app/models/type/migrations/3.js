'use strict';

import Mungo from 'mungo';
import sequencer from 'promise-sequencer';
import parents from 'syn/../../fixtures/type/2.json';

/** Put parents
===
Add parents
*/

class Type extends Mungo.Migration {

  static version = 3;

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

      () => Promise.all(parents.map(parent => sequencer([

        () => Promise.all([
          this.findOne({ name : parent.name }),
          this.findOne({ name : parent.parent })
        ]),

        results => Promise.all([

          this.revert({
            update  : {
              get   : { _id : results[0]._id },
              set   : { parent : results[0].parent }
            }
          }),

          this.updateById(results[0]._id, { parent : results[1] })

        ])

      ]))),

    ]);
  }
}

export default Type;
