'use strict';

import Mungo       from 'mungo';
import V1         from './migrations/1';
import V2         from './migrations/2';

class Race extends Mungo.Model {
  static schema () {
    return {
      "name" : String
    };
  }
}

Race.migrations = {
  1 : V1,
  2 : V2
};

Race.version = 2;

export default Race;
