'use strict';

import { EventEmitter } from 'events';

class Emitter extends EventEmitter {
  constructor () {
    super();

    this
      .on('created', (collection, document) => {
        // console.log(`created new document in ${collection.bold}`.blue, document);
        this.emit('create', collection, document);
      })

      .on('updated', (collection, document) => {
        // console.log(`updated document in ${collection.bold}`.blue, document.toJSON());
        this.emit('update', collection, document);
      })

      .on('removed', (collection, document) => {
        this.emit('remove', collection, document);
      });
  }
}

export default new Emitter();
