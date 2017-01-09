'use strict';

import Mungo                      from 'mungo';
import User                       from '../user';
import Item                       from '../item';
import getAccumulation            from './statics/get-accumulation';
//import lambda                     from './statics/lambda';
import Model                      from '../../lib/app/model';

class QVote extends Model {

  static version = 1;

  static get schema () {
    return {
      "item"             :   {
      	"type"           :   Item,
      	"required"       :   true
      },
      "criteria"         :   {
      	"type"           :   String,
      	"required"       :   true
      },
      "user"             :   {
      	"type"           :   User,
      	"required"       :   true
      }
    };
  }

  static collection = 'qvote';

  static inserted () {
    return [this.emit.bind(this, 'created')];
  }

  static getAccumulation (...args) {
    return getAccumulation.apply(this, args);
  }

// this is copied over from vote. the code for lambda is not modified yet.
 // static lambda (...args) { 
 //   return lambda.apply(this, args);
//}
}

export default QVote;
