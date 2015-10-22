'use strict';

import Mung from 'mung';
import User from '../user';
import findCurrent from './statics/find-current';
import V1 from './migrations/1';
import V2 from './migrations/2';

class Discussion extends Mung.Model {
  static schema () {
    return {
      "subject"       :   {
        "type"        :   String,
        "required"    :   true
      },
      "description"   :   {
        "type"        :   String,
        "required"    :   true
      },
      "deadline"      :   {
        "type"        :   Date,
        "required"    :   true
      },
      "starts"        :   {
        "type"        :   Date,
        "required"    :   true
      },
      "goal"          :   {
        "type"        :   Number,
        "required"    :   true
      },
      "registered"    :   [{
        "type"        :   User,
        "required"    :   true
      }]
    };
  }

  static findCurrent (...args) {
    return findCurrent.apply(this, args);
  }
}

Discussion.version = 3;

Discussion.migrations = {
  1 : V1,
  2 : V2
};

export default Discussion;
