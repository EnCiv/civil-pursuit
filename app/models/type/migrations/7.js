'use strict';

/**
 *  New: types have now ids to make them more readable
 *  So here we add ids to old types who don't have them
**/

import collectionId       from '../../../lib/app/collection-id';
import Mungo              from 'mungo';
import sequencer          from 'sequencer';

class Type extends Mungo.Migration {

  static version = 7;

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

      "parent"      :     Type,

      "id"          :     String
    };
  }

  static do () {
    return sequencer([

      // get types that have no ids

      () => this.find({ __V : { $lt : 7 }, id : { $exists : false } }).limit(0),
      // add id and save migrations

      types => Promise.all(types.map(type => sequencer([

        () => collectionId(this),

        id => this.updateById(type, { id }),

        type => this.revert({ unset : {
          fields : ['id'],
          get : { _id : type._id }
        }})

      ])))

    ]);
  }
}

export default Type;
