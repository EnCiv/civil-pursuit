'use strict';

import Mungo from 'mungo';
import findValueByName from './statics/find-value-by-name';
import V1 from './migrations/1';

class Config extends Mungo.Model {
  static schema () {
    return {
      name : {
        type : String,
        required : true,
        unique : true
      },
      value : Mungo.Mixed
    };
  }

  static findValueByName (...args) {
    return findValueByName.apply(this, args);
  }

  static get (...args) {
    return findValueByName.apply(this, args);
  }
}

Config.version = 1;

Config.migrations = {
  1 : V1
};

Config.collection = 'config';

export default Config;
