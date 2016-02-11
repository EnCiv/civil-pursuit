'use strict';

import Mungo                      from 'mungo';
import User                       from '../user';
import Item                       from '../item';
import Criteria                   from '../criteria';
import getAccumulation            from './statics/get-accumulation';
import lambda                     from './statics/lambda';
import Model                      from '../../lib/app/model';

class Vote extends Model {

  static version = 1;

  static get schema () {
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

  static inserted () {
    return [this.emit.bind(this, 'created')];
  }

  static getAccumulation (...args) {
    return getAccumulation.apply(this, args);
  }

  static lambda (...args) {
    return lambda.apply(this, args);
  }
}

export default Vote;
