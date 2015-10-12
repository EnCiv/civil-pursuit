'use strict';

import Mung from '../../lib/mung';

class Type extends Mung.Model {
  static schema () {
    return {
      "name"        :     {
        type        :     String,
        unique      :     true
      },

      "harmony"     :     [Type],

      "parent"      :     Type
    };
  }
}

export default Type;
