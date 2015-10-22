'use strict';

import Mung from 'mung';
import User from '../user';
import Item from '../item';
import Criteria from '../criteria';

class Vote extends Mung.Model {
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
