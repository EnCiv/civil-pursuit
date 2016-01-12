'use strict';

import config from '../../secret.json';
import Type from '../models/type';
import Config from '../models/config';

function getTopLevelType (event) {
  try {
    console.log('new API event', event);

    Config
      .get('top level type')
      .then(
        value => {
          try {
            console.log('Config said', value);
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
