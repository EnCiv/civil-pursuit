'use strict';

import Mungo                      from 'mungo';
import User                       from '../user';
import findCurrent                from './statics/find-current';
import V1                         from './migrations/1';
import V2                         from './migrations/2';

class Discussion extends Mungo.Model {
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
      "registered"    :   {
        "type"        :   [User],
        "default"     :   []
      }
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
