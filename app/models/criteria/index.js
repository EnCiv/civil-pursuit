'use strict';

import Mung from 'mung';
import V1   from './migrations/1';

class Criteria extends Mung.Model {
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
  1 : V1
};

Criteria.version = 2;

export default Criteria;
