'use strict';

import Mungo from 'mungo';
import User from '../user';
import Item from '../item';
import Criteria from '../criteria';
import getAccumulation from './statics/get-accumulation';

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

  static getAccumulation (...args) {
    return getAccumulation.apply(this, args);
  }

  static lambda (options = {}) {
    const vote = {};

    const promises = [

      new Promise((ok, ko) => {
        if ( 'item' in options ) {
          if ( options.item instanceof Item ) {
            return ok(item);
          }
        }
      })

    ];

    return Promise.all(promises).then(results => {
      const [ item ] = results;
    }, ko);
  }
}

export default Vote;
