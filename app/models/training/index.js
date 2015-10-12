'use strict';

import Mung from '../../lib/mung';

class Training extends Mung.Model {
  static schema () {
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
      wait              :   Number,
      listen            :   String
    };
  }
}

export default Training;
