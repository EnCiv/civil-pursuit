'use strict';

import Mung from '../../lib/mung';
import Item from '../item';
import User from '../user';

class Feedback extends Mung.Model {
  static schema () {
    return {
      "item"          :  {
        type          :  Item,
        required      :  true
      },
      "user"          :  {
        type          :  User,
        required      :  true
      },
      "feedback"      :  {
        type          :  String,
        required      :  true
      },
      "created"       :  {
        "type"        :  Date,
        "default"     :  Date.now
      }
    };
  }
}

Feedback.collection = 'feedback';

export default Feedback;
