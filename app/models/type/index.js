'use strict';

import Mung from '../../lib/mung';
import isHarmony from './methods/is-harmony';

class Type extends Mung.Model {
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
}

export default Type;
