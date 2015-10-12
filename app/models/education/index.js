'use strict';

import Mung       from '../../lib/mung';
import V1         from './migrations/1';
import V2         from './migrations/2';

class Education extends Mung.Model {
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
