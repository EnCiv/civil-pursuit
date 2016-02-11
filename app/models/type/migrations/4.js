'use strict';

import Mungo          from 'mungo';
import sequencer      from 'sequencer';
import harmonies      from 'syn/../../fixtures/type/3.json';

/** Add harmonies to Type*/

class Type extends Mungo.Migration {

  static version = 4;

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

      // attach harmonies -- if  not yet in DB

      () => Promise.all(harmonies.map(harmony => sequencer([

        () => sequencer([
          () => this.findOne({ name : harmony.name }),
          () => this.findOne({ name : harmony.harmony[0] }),
          () => this.findOne({ name : harmony.harmony[1] })
        ]),

        results => Promise.all([

          this.updateById(results[0]._id,
            { harmony : [results[1], results[2]] }
          ),

          this.revert({
            update    :   {
              get     :   { _id : results[0]._id },
              set     :   { harmony : results[0].harmony || this.getSchema().harmony.default }
            }
          })

        ])

      ])))

    ]);
  }
}

export default Type;
