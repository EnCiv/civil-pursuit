'use strict';

import Mungo                          from 'mungo';
import Item                           from '../item';
import User                           from '../user';
import V1                             from './migrations/1';
import lambda                         from './statics/lambda';

class Feedback extends Mungo.Model {

  static version = 2

  static collection = 'feedback'

  static migrations = {
    1 : V1
  }

  static get schema () {
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

  static lambda(...args) {
    return lambda.apply(this, args);
  }
}

export default Feedback;
