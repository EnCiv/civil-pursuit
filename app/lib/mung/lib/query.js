'use strict';

import Mung from './mung';

class Query {
  constructor (options = {}) {
    this.options = options;

    if ( ! this.options.model ) {
      throw new Error('Missing model');
    }
  }

  connection () {
    let { connection } = this.options;

    if ( ! connection ) {
      connection = Mung.connections[0];
    }

    if ( ! connection ) {
      throw new Error('No connection');
    }

    return connection;
  }

  collection () {
    return new Promise((ok, ko) => {
      try {
        let { collection } = this.options;

        if ( ! collection ) {
          const connection = this.connection();
          const { connected, db } = connection;

          if ( ! connected ) {
            connection.on('connected', () => {
              this.collection().then(ok, ko);
            });
            return;
          }

          if ( this.options.collectionName ) {
            collection = db.collection(this.options.collectionName);
          }
          else {
            const { model } = this.options;

            if ( ! model ) {
              throw new Error('No model');
            }

            collection = db.collection(model.toCollectionName());
          }
        }

        if ( ! collection ) {
          throw new Error('No collection');
        }

        ok(collection);
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  ensureIndexes (collection, schema) {
    return new Promise((ok, ko) => {
      try {
        this.buildIndexes(this.options.model.indexes, collection)
          .then(ok,
            error => {
              if ( error.code === 26 ) { /** No collection **/
                ok();
              }
              else {
                ko(error);
              }
            });
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  buildIndexes (indexes = [], collection) {
    return new Promise((ok, ko) => {
      try {
        collection
          .indexes()
          .then(
            keys => {
              try {

                indexes = indexes.map(index => {
                  index.exists = keys.some(key => key.name === index.name);

                  return index;
                });

                let promises = indexes
                  .filter(index => ! index.exists)
                  .map(index => {
                    let options = { v : 1, name : index.name };

                    if ( index.unique ) {
                      options.unique = true;
                    }

                    if ( index.force ) {
                      options.dropDups = true;
                    }

                    return collection.createIndex(index.key, options);
                  });

                Promise.all(promises).then(
                  results => {
                    results.forEach(indexName => {
                      indexes = indexes.map(index => {
                        if ( index.name === indexName ) {
                          index.created = true;
                        }
                        return index;
                      });
                    });
                    ok(indexes);

                    Mongol.events.emit('log', {
                      Index : {
                        toDB : indexes
                      }
                    });
                  },
                  ko
                );
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  parse (query) {
    const { Model, Util } = Mung;
    const { model } = this.options;

    return Mung.parse(query, new model().__types) || {};
  }

  remove (document, options = {}) {
    return new Promise((ok, ko) => {
      try {
        const { model } = this.options;
        let { schema } = model;

        if ( typeof schema === 'function' ) {
          schema = schema();
        }

        this.collection()
          .then(
            collection => {
              try {
                if ( options.one ) {
                  collection
                    .deleteOne(this.parse(document))
                    .then(ok, ko);
                }
                else {
                  collection
                    .deleteMany(this.parse(document))
                    .then(ok, ko);
                }
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  insert (document, id) {
    return new Promise((ok, ko) => {
      try {
        const { model } = this.options;
        let { schema } = model;

        if ( typeof schema === 'function' ) {
          schema = schema();
        }

        this.collection()
          .then(
            collection => {
              try {
                this.ensureIndexes(collection, schema)
                  .then(
                    () => {
                      try {
                        if ( id ) {
                          collection
                            .replaceOne({ _id : id }, document)
                            .then(
                              () => {
                                ok();
                              },
                              ko
                            );
                        }
                        else {
                          collection
                            .insertOne(document)
                            .then(ok, ko);
                        }
                      }
                      catch ( error ) {
                        ko(error);
                      }
                    },
                    ko
                  );
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  find (document, options = { limit : 100 }) {
    return new Promise((ok, ko) => {
      try {
        const { Document } = Mung;
        const { model } = this.options;
        let { schema } = model;

        if ( typeof schema === 'function' ) {
          schema = schema();
        }

        this.collection()
          .then(
            collection => {
              try {
                this.ensureIndexes(collection, schema)
                  .then(
                    () => {
                      try {
                        let limit = 'limit' in options ? options.limit : 100;
                        let skip = options.skip || 0;
                        let sort = options.sort || { _id : 1 };

                        if ( options.reverse ) {
                          sort = { _id : -1 };
                        }

                        const parsed = this.parse(document);

                        collection
                          .find(parsed)
                          .limit(limit)
                          .skip(skip)
                          .sort(sort)
                          .toArray()
                          .then(
                            documents => {
                              try {
                                documents = documents.map(doc => new model(doc));

                                if ( options.one ) {
                                  documents = documents[0];
                                }

                                if ( documents ) {
                                  Object.defineProperties(document, {
                                    __query : {
                                      numerable : false,
                                      writable : false,
                                      value : parsed
                                    },

                                    __limit : {
                                      numerable : false,
                                      writable : false,
                                      value : limit
                                    },

                                    __skip : {
                                      numerable : false,
                                      writable : false,
                                      value : skip
                                    },

                                    __sort : {
                                      numerable : false,
                                      writable : false,
                                      value : sort
                                    }
                                  });
                                }

                                ok(documents);
                              }
                              catch ( error ) {
                                ko(error);
                              }
                            },
                            ko
                          );
                      }
                      catch ( error ) {
                        ko(error);
                      }
                    },
                    ko
                  );
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  count (document, options = {}) {
    return new Promise((ok, ko) => {
      try {
        const { Document } = Mung;
        const { model } = this.options;
        let { schema } = model;

        if ( typeof schema === 'function' ) {
          schema = schema();
        }

        this.collection()
          .then(
            collection => {
              try {
                this.ensureIndexes(collection, schema)
                  .then(
                    () => {
                      try {
                        collection
                          .count(this.parse(document))
                          .then(
                            count => {
                              try {
                                ok(count);
                              }
                              catch ( error ) {
                                ko(error);
                              }
                            },
                            ko
                          );
                      }
                      catch ( error ) {
                        ko(error);
                      }
                    },
                    ko
                  );
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

}

Mung.Query = Query;
