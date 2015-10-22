'use strict';

import Mung               from 'mung';
import V1                 from './migrations/1';
import V2                 from './migrations/2';

class Country extends Mung.Model {
  static schema () {
    return {
      "name" : String
    };
  }
}

Country.collection = 'countries';

Country.migrations = {
  1 : V1,
  2 : V2
};

Country.version = 2;

export default Country;
