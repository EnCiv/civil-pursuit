'use strict';

import Mungo from 'mungo';

class AppError extends Mungo.Model {
  static version = 3;

  static schema = {
    "name"        :   {
      type        :   String,
      required    :   true
    },

    "message"     :   {
      type        :   String,
      required    :   true
    },

    "code"        :   String,

    "stack"       :   [String],

    "debug"       :   Object,

    "repair"      :   [Mungo.Type.Mixed],

    "created"     :   {
      "type"      :   Date,
      "default"   :   new Date()
    }
  };

  static throwError (error) {
    const err = {
      name      :   error.name,
      message   :   error.message,
      stack     :   error.stack.split(/\n/)
    };

    for ( let optional of ['code', 'debug', 'repair'] ) {
      if ( optional in error ) {
        err[optional] = error[optional];
      }
    }

    return this.create(err);
  }
}

export default AppError;
