'use strict';

import Mung from '../../lib/mung';

class Criteria extends Mung.Model {
  static schema () {
    return {
      "name"          : 	{
        type          :   String,
        required      :   true
      },
      "description"   : 	{
        type          :   String,
        required      :   true
      }
    };
  }
}

export default Criteria;
