'use strict';

import config from '../../secret.json';
import Type from '../models/type';

function getTopLevelType (event) {
  try {
    Type
      .findOne({ name : config['top level item'] })
      .then(
        type => this.ok(event, type),
        this.error.bind(this)
      )
  }
  catch ( error ) {
    this.error('error');
  }
}

export default getTopLevelType;
