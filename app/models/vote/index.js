'use strict';

import Mungo from 'mungo';
import User from '../user';
import Item from '../item';
import Criteria from '../criteria';

class Vote extends Mungo.Model {
  static schema () {
    return {
      "item"             :   {
      	"type"           :   Item,
      	"required"       :   true
      },
      "criteria"         :   {
      	"type"           :   Criteria,
      	"required"       :   true
      },
      "user"             :   {
      	"type"           :   User,
      	"required"       :   true
      },
      "value"            :   {
      	"type"           :   Number,
      	"required"       :   true
      }
    };
  }
}

export default Vote;
