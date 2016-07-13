'use strict';

import Mungo from 'mungo';
import emitter from './emitter';

class Model extends Mungo.Model {
  static emit (event, document) {
    return new Promise((ok, ko) => {
      try {
        console.info("Model", event, this.collection);
        emitter.emit(event, this.collection, document);
        ok();
      }
      catch ( error ) {
        ko(error);
      }
    });
  }
}

export default Model;
