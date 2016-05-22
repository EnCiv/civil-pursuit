'use strict';

import Mungo       from 'mungo';
import V1         from './migrations/1';

class PoliticalTendency extends Mungo.Model {
  static version = 1;

  static collection = 'political_tendency';

  static migrations = {
    1 : V1
  };

  static schema = { name : String };
}

export default PoliticalTendency;
