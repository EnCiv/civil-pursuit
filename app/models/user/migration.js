'use strict';

import Schema from './schema';
import V2 from './migrations/2';
import V3 from './migrations/3';

class Migration extends Schema {
  static version = 4;

  static migrations = {
    2 : V2,
    3 : V3
  };
}

export default Migration;
