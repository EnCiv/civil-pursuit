'use strict';

import Mungo          from 'mungo';
import get            from './statics/get';
import set            from './statics/set';
import V1             from './migrations/1';

class Config extends Mungo.Model {

  static version      =   1;

  static migrations   =   {
    1                 :   V1
  };

  static collection   =   'config';

  static get schema () {
    return        {
      name        :   {
        type      :   String,
        required  :   true,
        unique    :   true
      },
      value       :   Mungo.Type.Mixed
    };
  };

  static get (...args) {
    return get.apply(this, args);
  }

  static set (...args) {
    return set.apply(this, args);
  }
}

export default Config;
