'use strict';

import Mungo         from 'mungo';
import toSlug       from '../../lib/util/to-slug';
import isHarmony    from './methods/is-harmony';
import getSubtype   from './methods/get-subtype';
import V2           from './migrations/2';

class Type extends Mungo.Model {
  static schema () {
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

  isHarmony (...args) {
    return isHarmony.apply(this, args);
  }

  getSubtype (...args) {
    return getSubtype.apply(this, args);
  }

  get link () {
    return `/item/${this.id}/${toSlug(this.subject)}`;
  }
}

Type.migrations = {
  2 : V2
};

export default Type;
