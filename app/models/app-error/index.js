'use strict';

import Mung from 'mung';

class AppError extends Mung.Model {
  static schema () {
    return {
      name        :   String,
      message     :   String,
      code        :   String,
      stack       :   String,
      debug       :   Object,
      repair      :   [Mung.Mixed]
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
