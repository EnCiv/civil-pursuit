'use strict';

import Mungo                          from 'mungo';
import Item                           from '../item';
import User                           from '../user';
import V1                             from './migrations/1';
import lambda                         from './statics/lambda';
import emitter                        from 'syn/../../dist/lib/app/emitter';

class Feedback extends Mungo.Model {

  static version = 2;

  static collection = 'feedback';

  static migrations = {
    1 : V1
  };

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
  };

  static lambda(...args) {
    return lambda.apply(this, args);
  }

  static inserted () {
    return [
      this.emit.bind(this, 'created')
    ];
  }

  static emit (event, feedback) {
    return new Promise((ok, ko) => {
      emitter.emit('create', this.collection, feedback);
      ok();
    });
  }
}

export default Feedback;
