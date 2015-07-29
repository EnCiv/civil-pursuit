'use strict';

import ConfigModel from '../models/config';

function getConfig (event) {
  try {
    ConfigModel
      .findOne()
      .lean()
      .exec()
      .then(
        config => {
          try {
            this.ok(event, config);
          }
          catch ( error ) {
            this.error(error);
          }
        },
        error => { this.error(error) }
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default getConfig;
