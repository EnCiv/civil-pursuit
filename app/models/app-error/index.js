'use strict';

import Mungo from 'mungo';

class AppError extends Mungo.Model {
  static schema () {
    return {
      name        :   String,
      message     :   String,
      code        :   String,
      stack       :   String,
      debug       :   Object,
      repair      :   [Mungo.Mixed]
    };
  }

  static throwError (error) {
    return this.create({
      name      :   error.name,
      message   :   error.message,
      code      :   error.code,
      stack     :   error.stack,
      debug     :   error.debug,
      repair    :   error.repair
    });
  }
}

export default AppError;
