'use strict';

import Mungo from 'mungo';
import V1 from './migrations/1';
import V2 from './migrations/2';

class Training extends Mungo.Model {

  static version = 2

  static migrations = {
    // 1 : V1,
    2 : V2
  }

  static get schema () {
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
        type            :   Mungo.Mixed,
        validate        :   value => {
          const validated = Mungo.validate(value, Number);

          if ( validated ) {
            return true;
          }

          return Mungo.validate(value, String);
        }
      },
      listen            :   String
    };
  }
}

export default Training;
