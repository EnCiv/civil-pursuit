'use strict';

import Mung from '../../lib/mung';
import User from '../user';

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
}

export default Discussion;
