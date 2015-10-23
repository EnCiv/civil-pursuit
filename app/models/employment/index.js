'use strict';

import Mungo       from 'mungo';
import V1         from './migrations/1';
import V2         from './migrations/2';

class Employment extends Mungo.Model {
  static schema () {
    return {
      "name" : String
    };
  }
}

Employment.migrations = {
  1 : V1,
  2 : V2
};

Employment.version = 2;

export default Employment;
