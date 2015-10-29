'use strict';

import Mungo from 'mungo';
import Item from '../item';
import User from '../user';
import V1 from './migrations/1';

class Feedback extends Mungo.Model {
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

Feedback.migrations = {
  1 : V1
};

Feedback.version = 2;

export default Feedback;
