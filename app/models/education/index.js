'use strict';

import Mungo       from 'mungo';
import V1         from './migrations/1';
import V2         from './migrations/2';

class Education extends Mungo.Model {
  static schema () {
    return {
      "name" : String
    };
  }
}

Education.migrations = {
  1 : V1,
  2 : V2
};

Education.version = 2;

export default Education;
