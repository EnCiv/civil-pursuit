'use strict';

import Mungo       from 'mungo';
import V1         from './migrations/1';
import V2         from './migrations/2';

class MaritalStatus extends Mungo.Model {
  static schema () {
    return {
      "name" : String
    };
  }
}

MaritalStatus.migrations = {
  1 : V1,
  2 : V2
};

MaritalStatus.version = 2;

MaritalStatus.collection = 'marital_statuses';

export default MaritalStatus;
