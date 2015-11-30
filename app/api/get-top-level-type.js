'use strict';

import config from '../../secret.json';
import Type from '../models/type';
import Config from '../models/config';

function getTopLevelType (event) {
  try {
    Config
      .get('top level type')
      .then(
        value => {
          try {
            Type
              .findById(value)
              .then(
                type => this.ok(event, type.toJSON()),
                this.error.bind(this)
              )
          }
          catch ( error ) {
            this.error('error');
          }
        },
        this.error.bind(this)
      );
  }
  catch ( error ) {
    this.error('error');
  }
}

export default getTopLevelType;
