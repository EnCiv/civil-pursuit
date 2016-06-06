'use strict';

import Mungo                      from 'mungo';
import User                       from '../user';
import Item                       from '../item';
import getAccumulation            from './statics/get-accumulation';
import Model                      from '../../lib/app/model';

class Upvote extends Model {

  static version = 1;

  static get schema () {
    return {
      "item"             :   {
      	"type"           :   Item,
      	"required"       :   true
      },
      "user"             :   {
      	"type"           :   User,
      	"required"       :   true
      },
      "value"            :   {
      	"type"           :   Number,
      	"required"       :   true
      },
      "date"         :   {
        "type"           :   Date,
        "required"       :   true
      }
    };
  }

  static collection = 'upvote';

  static inserted () {
    return [this.emit.bind(this, 'created')];
  }

  static getAccumulation (...args) {
    return getAccumulation.apply(this, args);
  }

}

export default Upvote;
