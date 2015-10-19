'use strict';

import Mung from '../../lib/mung';
import V1 from './migrations/1';
import V2 from './migrations/2';

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
      wait              :   {
        type            :   Mung.Mixed,
        validate        :   value => {
          const validated = Mung.validate(value, Number);

          if ( validated ) {
            return true;
          }

          return Mung.validate(value, String);
        }
      },
      listen            :   String
    };
  }
}

Training.version = 2;

Training.migrations = {
  1 : V1,
  2 : V2
};

export default Training;
