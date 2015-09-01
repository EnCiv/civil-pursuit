'use strict';

import config from '../../secret.json';
import TypeModel from '../models/type';

function getTopLevelType (event) {
  try {
    TypeModel
      .findOne({ name : config['top level item'] })
      .exec()
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
