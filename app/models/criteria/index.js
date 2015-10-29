'use strict';

import Mungo from 'mungo';
import V1   from './migrations/1';
import V2   from './migrations/2';

class Criteria extends Mungo.Model {
  static schema () {
    return {
      "name"          : 	{
        type          :   String,
        required      :   true
      },
      "description"   : 	{
        type          :   String,
        required      :   true
      }
    };
  }
}

Criteria.migrations = {
  1 : V1,
  2 : V2
};

Criteria.version = 2;

export default Criteria;
