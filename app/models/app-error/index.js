'use strict';

import Mung from '../../lib/mung';

class AppError extends Mung.Model {
  static schema () {
    return {
      name        :   String,
      message     :   String,
      code        :   String,
      stack       :   [String],
      debug       :   Object,
      repair      :   [Mung.Mixed]
    };
  }
}

export default AppError;
