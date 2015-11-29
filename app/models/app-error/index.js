'use strict';

import Mungo from 'mungo';

class AppError extends Mungo.Model {
  static schema () {
    return {
      name        :   {
        type      :   String,
        required  :   true
      },
      message     :   {
        type      :   String,
        required  :   true
      },
      code        :   String,
      stack       :   {
        type      :   String,
        required  :   true
      },
      debug       :   Object,
      repair      :   [Mungo.Mixed]
    };
  }

  static throwError (error) {
    const err = {
      name      :   error.name,
      message   :   error.message,
      stack     :   error.stack
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
