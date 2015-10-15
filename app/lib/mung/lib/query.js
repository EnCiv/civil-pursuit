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

  ensureIndexes (collection) {
    return new Promise((ok, ko) => {
      try {
        this.buildIndexes(new (this.options.model)().__indexes, collection)
          .then(
            () => {
              ok();
            },
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

        const fn = collection
          .indexes();

        fn.then(
            keys => {
              try {
                indexes = indexes.map(index => {
                  index[2] = keys.some(key => key.name === index[1].name);

                  return index;
                });

                let promises = indexes
                  .filter(index => ! index[2])
                  .map(index => collection.createIndex(index[0], index[1]));

                Promise.all(promises).then(
                  results => {
                    try {
                      results.forEach(indexName => {
                        indexes = indexes.map(index => {
                          if ( index.name === indexName ) {
                            index.created = true;
                          }
                          return index;
                        });
                      });
                      ok(indexes);
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

  parse (query) {
    const { Model, Util } = Mung;
    const { model } = this.options;

    return Mung.parse(query, new (this.options.model)().__types);
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

        this.collection().then(collection => {
          try {

            const started = Date.now();

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
                .then(
                  document => {
                    try {
                      if ( document ) {
                        Object.defineProperty(document, '__queryTime', {
                          enumerable : false,
                          writable : false,
                          value : Date.now() - started
                        });
                      }
                      ok(document);
                    }
                    catch ( error ) {
                      ko(error);
                    }
                  },
                  ko
                );
            }
          }
          catch ( error ) {
            ko(error);
          }
        });
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

        this.collection().then(collection => {
          try {
            let limit = 'limit' in options ? options.limit : 100;
            let skip = options.skip || 0;
            let sort = options.sort || { _id : 1 };

            if ( options.reverse ) {
              sort = { _id : -1 };
            }

            const parsed = this.parse(document);

            let query;

            if ( options.one ) {
              if ( collection.findOne ) {
                query = collection
                  .findOne(parsed, { skip, sort });
              }
              else {
                query = collection
                  .find(parsed)
                  .limit(1)
                  .skip(skip)
                  .sort(sort);
              }
            }

            else {
              query = collection
                .find(parsed)
                .limit(limit)
                .skip(skip)
                .sort(sort)
                .toArray();
            }

            query.then(
              documents => {
                try {
                  if ( options.one ) {
                    if ( collection.findOne ) {
                      if ( documents ) {
                        documents = new model(documents);
                      }
                    }
                    else if ( documents.length ) {
                      documents = new model(documents[0]);
                    }
                  }
                  else {
                    documents = documents.map(doc => new model(doc));
                  }

                  if ( documents ) {

                    const packAndGo = () => {

                      if ( documents ) {
                        Object.defineProperties(documents, {
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
                    };

                    if ( options.populate ) {
                      if ( options.one && documents ) {
                        documents
                          .populate(options.populate)
                          .then(
                            () => packAndGo,
                            ko
                          );
                      }
                      else {
                        Promise
                          .all(
                            documents.map(document => document.populate(options.populate))
                          )
                          .then(
                            () => packAndGo,
                            ko
                          );
                      }
                    }
                    else {
                      packAndGo();
                    }
                  }

                  else {
                    ok(documents);
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

        let parsed;

        try {
          parsed = this.parse(document);
        }
        catch ( error ) {
          console.log(document);
          throw new (Mung.Error)(`Could not count from ${model.name}: parse error`);
        }

        this.collection().then(collection => {
          try {
            collection
              .count(parsed)
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
        });
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

}

Mung.Query = Query;
