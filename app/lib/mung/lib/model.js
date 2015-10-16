'use strict';

import Mung from './mung';
import mongodb from 'mongodb';

class Model {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (document = {}, options = {}) {
    const schema = this.constructor.getSchema();

    Object.defineProperties(this, {
      __document    :   {
        value       :   {}
      },

      __schema      :   {
        value       :   schema
      },

      __types       :   {
        value       :   this.parseTypes(schema)
      },

      __indexes     :   {
        value       :   this.parseIndexes(schema)
      },

      __defaults    :   {
        value       :   this.parseDefaults(schema)
      },

      __required    :   {
        value       :   this.parseRequired(schema)
      },

      __private     :   {
        value       :   this.parsePrivate(schema)
      },

      __distinct    :   {
        value       :   this.parseDistinct(schema)
      }
    });

    if ( options._id && ! document._id ) {
      document._id = Mung.ObjectID();
    }

    let original = {};

    for ( let field in document ) {
      this.set(field, document[field]);
      original[field] = document[field];
    }

    Object.defineProperty(this, '__original', {
      value : original
    });

    if ( this._id ) {
      Object.defineProperty(this, '__timeStamp', {
        value : this._id.getTimestamp()
      });
    }

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  parseIndexes (schema, ns = '') {

    let indexes = [];

    for ( let field in schema ) {

      let fields = {};

      let options = {};

      let fieldName = ns ? `${ns}.${field}` : field;

      if ( Array.isArray(schema[field]) ) {
        let subindexes = this.parseIndexes(schema[field][0], fieldName);
        indexes.push(...subindexes);
      }

      else if ( typeof schema[field] === 'object' ) {
        if ( schema[field].index || schema[field].unique ) {
          let index = schema[field].index || schema[field].unique;

          if ( index === true ) {
            fields[fieldName] = 1;

            options.name = `${fieldName}_1`;
          }

          else if ( typeof index === 'string' ) {
            fields[fieldName] = index;

            options.name = `${fieldName}_${index}`;
          }

          else if ( Array.isArray(index) ) {
            fields[fieldName] = 1;

            let names = [`${fieldName}_1`];

            index.forEach(field => {
              fields[field] = 1;
              names.push(`${field}_1`);
            });

            options.name = names.join('_');
          }

          else if ( typeof index === 'object' ) {
            fields[fieldName] = index.sort || 1;

            let names = [`${fieldName}_1`];

            if ( Array.isArray(index.fields) ) {
              index.fields.forEach(field => {
                fields[field] = 1;
                names.push(`${field}_1`);
              });
            }

            else if ( typeof index.fields === 'object' ) {
              for ( let f in index.fields ) {
                fields[f] = index.fields[f];
                names.push(`${f}_${index.fields[f]}`);
              }
            }

            for ( let option in index ) {
              if ( option !== 'sort' && option !== 'fields' ) {
                options[option] = index[option];
              }
            }

            if ( ! options.name ) {
              options.name = names.join('_');
            }
          }

          indexes.push([ fields, options ]);
        }

        if ( typeof schema[field].type === 'object' ) {
          let subindexes = this.parseIndexes(schema[field].type, fieldName);
          indexes.push(...subindexes);
        }
      }

    }

    return indexes;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  parseDefaults (schema, ns = '') {
    let defaults = {};

    for ( let field in schema ) {

      let fieldName = ns ? `${ns}.${field}` : field;

      if ( Array.isArray(schema[field]) ) {

        let subdefaults = this.parseDefaults(schema[field][0], fieldName);

        if ( Object.keys(subdefaults).length ) {
          defaults[field] = {};

          for ( let subdefault in subdefaults ) {
            defaults[field][subdefault] = subdefaults[subdefault];
          }
        }
      }

      else if ( typeof schema[field] === 'object' ) {
        if ( 'default' in schema[field] ) {
          defaults[field] = schema[field].default;
        }

        if ( typeof schema[field].type === 'object' ) {
          let subdefaults = this.parseDefaults(schema[field].type, fieldName);

          if ( Object.keys(subdefaults).length ) {
            defaults[field] = {};

            for ( let subdefault in subdefaults ) {
              defaults[field][subdefault] = subdefaults[subdefault];
            }
          }
        }
      }

    }

    return defaults;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  parseRequired (schema) {
    let required = {};

    for ( let field in schema ) {

      if ( Array.isArray(schema[field]) ) {
        let subrequired = this.parseRequired(schema[field][0]);

        if ( Object.keys(subrequired).length ) {
          required[field] = {};

          for ( let subreq in subrequired ) {
            required[field][subreq] = subrequired[subreq];
          }
        }
      }

      else if ( typeof schema[field] === 'object' ) {
        if ( schema[field].required ) {
          required[field] = true;
        }

        if ( typeof schema[field].type === 'object' ) {
          let subrequired = this.parseRequired(schema[field].type);

          if ( Object.keys(subrequired).length ) {
            required[field] = {};

            for ( let subreq in subrequired ) {
              required[field][subreq] = subrequired[subreq];
            }
          }
        }
      }

    }

    return required;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  parsePrivate (schema) {
    let _private = {};

    for ( let field in schema ) {

      if ( Array.isArray(schema[field]) ) {
        let subprivate = this.parsePrivate(schema[field][0]);

        if ( Object.keys(subprivate).length ) {
          _private[field] = {};

          for ( let subpriv in subprivate ) {
            _private[field][subpriv] = subprivate[subpriv];
          }
        }
      }

      else if ( typeof schema[field] === 'object' ) {
        if ( schema[field].private ) {
          _private[field] = true;
        }

        if ( typeof schema[field].type === 'object' ) {
          let subprivate = this.parsePrivate(schema[field].type);

          if ( Object.keys(subprivate).length ) {
            _private[field] = {};

            for ( let subpriv in subprivate ) {
              _private[field][subpriv] = subprivate[subpriv];
            }
          }
        }
      }

    }

    return _private;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  parseDistinct (schema) {
    let distinct = {};

    for ( let field in schema ) {

      if ( Array.isArray(schema[field]) ) {
        let subdistinct = this.parseDistinct(schema[field][0]);

        if ( Object.keys(subdistinct).length ) {
          distinct[field] = {};

          for ( let sub in subdistinct ) {
            distinct[field][sub] = subdistinct[sub];
          }
        }
      }

      else if ( typeof schema[field] === 'object' ) {
        if ( schema[field].distinct ) {
          distinct[field] = true;
        }

        if ( typeof schema[field].type === 'object' ) {
          let subdistinct = this.parseDistinct(schema[field].type);

          if ( Object.keys(subdistinct).length ) {
            distinct[field] = {};

            for ( let sub in subdistinct ) {
              distinct[field][sub] = subdistinct[subpriv];
            }
          }
        }
      }

    }

    return distinct;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  parseTypes (schema) {
    let types = {};

    for ( let field in schema ) {
      if ( typeof schema[field] === 'function' ) {
        types[field] = schema[field];
      }
      else if ( Array.isArray(schema[field]) ) {
        if ( typeof schema[field][0] === 'function' ) {
          types[field] = [schema[field][0]];
        }
        else {
          types[field] = [this.parseTypes(schema[field][0])];
        }
      }
      else if ( typeof schema[field] === 'object' ) {
        if ( typeof schema[field].type === 'function' ) {
          types[field] = schema[field].type;
        }
        else if ( Array.isArray(schema[field].type) ) {
          if ( typeof schema[field].type[0] === 'function' ) {
            types[field] = [schema[field].type[0]];
          }
          else {
            types[field] = [this.parseTypes(schema[field].type[0])];
          }
        }
        else if ( typeof schema[field].type === 'object' ) {
          types[field] = this.parseTypes(schema[field].type);
        }
      }
    }

    return types;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  set (field, value) {
    if ( typeof field === 'object' ) {
      for ( let _field in field ) {
        this.set(_field, field[_field]);
      }
      return this;
    }

    if ( typeof value === 'function' ) {
      value = value();
    }

    if ( field === '$push' ) {
      const array = Object.keys(value)[0];
      return this.push(array, value[array]);
    }

    // this.__document = Mung.set(this.__document, field, value, this.__types);

    if ( ! ( field in this.__schema ) ) {
      return this;
    }

    if ( value === null ) {
      this.__document[field] = null;
    }
    else {
      this.__document[field] = Mung.convert(value, this.__types[field]);
    }

    for ( let field in this.__document ) {
      if ( ! ( field in this ) ) {
        Object.defineProperty(this, field, {
          enumerable : true,
          configurable : true,
          get : () => {
            return this.__document[field];
          }
        });
      }
    }

    return this;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  verifyRequired () {
    for ( let field in this.__required ) {
      if ( ! ( field in this.__document ) ) {
        throw new (Mung.Error)(`Missing field ${field}`, { code : Mung.Error.MISSING_REQUIRED_FIELD });
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  applyDefault () {
    for ( let field in this.__defaults ) {
      if ( ! ( field in this.__document ) ) {
        let _default;

        if ( typeof this.__defaults[field] === 'function' ) {
          _default = this.__defaults[field]();
        }
        else {
          _default = this.__defaults[field];
        }

        this.__document[field] = _default;

        Object.defineProperty(this, field, {
          enumerable : true,
          configurable : true,
          get : () => {
            return this.__document[field];
          }
        });
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  push (field, value) {
    if ( ! ( field in this  ) ) {
      this.set(field, []);
    }

    if ( ! Array.isArray(this[field]) ) {
      throw new Error(`${this.constructor.name}.${field} is not an array`);
    }

    const type = this.__types[field][0];

    const casted = Mung.convert(value, type);

    if ( typeof casted !== 'undefined' ) {

      if ( this.__distinct[field] ) {
        const exists = this[field].some(item => {
          if ( type.equal ) {
            return type.equal(item, casted);
          }
          return item === casted;
        });

        if ( exists ) {
          throw new (Mung.Error)('Array only accepts distinct values', {
            code : Mung.Error.DISTINCT_ARRAY_CONSTRAINT,
            rejected : casted
          });
        }
      }

      this.__document[field].push(casted);
    }

    return this;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  filter (field, filter) {
    if ( Array.isArray(this.__document[field]) ) {
      this.__document[field] = this.__document[field].filter(filter);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  unset (field) {
    delete this.__document[field];

    return this;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  prepare (operation, options = {}) {
    return new Promise((ok, ko) => {
      try {
        if ( ! ( '__v' in this ) ) {
          this.__document.__v = 0;

          Object.defineProperty(this, '__v', {
            enumerable : true,
            configurable : true,
            get : () => {
              return this.__document.__v;
            }
          });
        }

        if ( ! ( '__V' in this ) ) {
          this.__document.__V = this.constructor.version || 0;

          Object.defineProperty(this, '__V', {
            enumerable : true,
            configurable : true,
            get : () => {
              return this.__document.__V;
            }
          });
        }

        let beforeValidation = [];

        if ( typeof this.constructor.validating === 'function' ) {
          beforeValidation = this.constructor.validating();
        }

        Mung.runSequence(beforeValidation, this)
          .then(
            () => {
              try {
                this.applyDefault();

                this.verifyRequired();

                let before = [];

                if ( operation === 'insert' && typeof this.constructor.inserting === 'function' ) {
                  before = this.constructor.inserting();
                }

                Mung.runSequence(before, this)
                  .then(ok, ko);
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

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  save (options = {}) {

    return new Promise((ok, ko) => {
      try {
        const started = Date.now();

        if ( ! this.__document._id || options.create ) {
          this.prepare('insert', options)
            .then(
              () => {
                try {
                  const { Query } = Mung;
                  new Query({ model : this.constructor })
                    .insert(this.__document)
                    .then(
                      created => {
                        try {
                          this.__document._id = created.insertedId;

                          Object.defineProperty(this, '__queryTime', {
                            enumerable : false,
                            writable : false,
                            value : created.__queryTime
                          });

                          if ( ! ( '__timeStamp' in this ) ) {
                            Object.defineProperty(this, '__timeStamp', {
                              enumerable : false,
                              writable : false,
                              value : created.insertedId.getTimestamp()
                            });
                          }

                          if ( ! ( '_id' in this ) ) {
                            Object.defineProperty(this, '_id', {
                              enumerable : true,
                              writable : false,
                              value : this.__document._id
                            });
                          }

                          if ( typeof this.constructor.inserted === 'function' ) {
                            const pipe = this.constructor.inserted();

                            if ( Array.isArray(pipe) ) {
                              Mung.runSequence(pipe, this).then(
                                () => {
                                  Object.defineProperty(this, '__totalQueryTime', {
                                    enumerable : false,
                                    writable : false,
                                    value : Date.now() - started
                                  });

                                  ok(this)
                                },
                                ko
                              );

                            }
                          }
                          else {
                            Object.defineProperty(this, '__totalQueryTime', {
                              enumerable : false,
                              writable : false,
                              value : Date.now() - started
                            });

                            ok(this);
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
        else {
          if ( ! ( '__v' in this.__document ) ) {
            this.__document.__v = 0;

            Object.defineProperty(this, '__v', {
              enumerable : true,
              configurable : true,
              get : () => {
                return this.__document.__v;
              }
            });
          }

          this.__document.__v ++;

          if ( ! ( '__V' in this.__document ) ) {
            this.__document.__V = this.constructor.version || 0;

            Object.defineProperty(this, '__V', {
              enumerable : true,
              configurable : true,
              get : () => {
                return this.__document.__V;
              }
            });
          }

          let updating = [];

          if ( typeof this.constructor.updating === 'function' ) {
            updating = updating.concat(this.constructor.updating());
          }

          this.applyDefault();

          Mung.runSequence(updating, this)
            .then(
              () => {
                try {
                  const { Query } = Mung;
                  new Query({ model : this.constructor })
                    .insert(this.__document, this.__document._id)
                    .then(
                      created => {
                        try {

                          if ( typeof this.constructor.updated === 'function' ) {
                            const pipe = this.constructor.updated();

                            if ( Array.isArray(pipe) ) {

                              Mung.runSequence(pipe, this).then(
                                () => ok(this),
                                ko
                              );
                            }
                            else {
                              ok(this);
                            }
                          }

                          else {
                            ok(this);
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
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  remove () {
    return new Promise((ok, ko) => {
      try {
        const model = this.constructor;
        let { schema } = model;

        if ( typeof schema === 'function' ) {
          schema = schema();
        }

        let removing = [];

        if ( typeof model.removing === 'function' ) {
          const pipe = model.removing();

          if ( Array.isArray(pipe) ) {
            removing = removing.concat(pipe);
          }
        }

        Mung.runSequence(removing, this).then(
          () => {
            try {
              const { Query } = Mung;
              new Query({ model })
                .remove({ _id : this._id }, { one : true })
                .then(
                  () => {
                    try {
                      ok(this.__document);

                      if ( typeof model.removed === 'function' ) {
                        const pipe = model.removed();

                        if ( Array.isArray(pipe) ) {
                          Mung.runSequence(pipe, this);
                        }
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

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toJSON (options = {}) {
    let json = {};

    for ( let key in this.__document ) {
      if ( this.__document[key] instanceof mongodb.ObjectID ) {
        json[key] = this.__document[key].toString();
      }
      else if ( ! this.__private[key] ) {
        json[key] = this.__document[key];
      }
    }

    if ( options.timeStamp || options.timestamp ) {
      json.__timeStamp = this.__timeStamp;
    }

    if ( options.populate ) {
      for ( let field in this.__populated ) {
        json[field] = this.__populated[field].toJSON(options);
      }
    }

    return json;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  populate (...foreigns) {
    return new Promise((ok, ko) => {
      try {

        let refs = [];

        if ( foreigns.length ) {
          for ( let field in this.__types ) {
            if ( foreigns.indexOf(field) > -1 && new (this.__types[field])() instanceof Model ) {
              refs.push({ field, model : this.__types[field] });
            }
          }
        }

        else {
          for ( let field in this.__types ) {
            if ( new (this.__types[field])() instanceof Model ) {
              refs.push({ field, model : this.__types[field] });
            }
          }
        }

        Promise
          .all(refs.map(ref => ref.model.findById(this[ref.field])))
          .then(
            populated => {
              Object.defineProperty(this, '__populated', {
                enumerable : false,
                writable : false,
                value : refs
                  .map((ref, index) => {
                    ref.document = populated[index];
                    return ref;
                  })
                  .reduce((populated, ref) => {
                    populated[ref.field] = ref.document;
                    return populated;
                  }, {})
              });

              ok();
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static convert (value) {
    if ( value ) {
      if ( value instanceof Mung.ObjectID ) {
        return value;
      }

      if ( value._id ) {
        return Mung.ObjectID(value._id);
      }

      if ( typeof value === 'String' ) {
        return Mung.ObjectID(value);
      }
    }

    throw new Error('Can not convert value to Model');
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static equal (a, b) {
    if ( a instanceof Mung.ObjectID ) {
      if ( b instanceof Mung.ObjectID ) {
        return a.equals(b);
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static schema () {
    return {};
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static getSchema () {
    let schema = this.schema();

    schema._id = Mung.ObjectID;

    schema.__v = Number;

    schema.__V = Number;

    return schema;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static find (document, options) {
    const constructor = this;
    const { Query } = Mung;

    if ( Array.isArray(document) ) {
      document = { $or : document };
    }

    return new Query({ model : this })
      .find(document, options);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static count (document, options) {
    const constructor = this;
    const { Query } = Mung;

    if ( Array.isArray(document) ) {
      document = { $or : document };
    }

    return new Query({ model : this })
      .count(document, options);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static findOne (where = {}) {
    return this.find(where, { one : true });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static findById (id) {
    return this.findOne({ _id : id });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static findByIds (...ids) {
    if ( ids.length === 1 && Array.isArray(ids[0]) ) {
      ids = ids[0];
    }
    return this.find({ _id : { $in : ids } });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static create (document, options) {
    return new Promise((ok, ko) => {
      try {
        if ( Array.isArray(document) ) {
          return Promise.all(document.map(document => this.create(document, options))).then(ok, ko);
        }

        let doc = new this(document);
        doc.save(options).then(ok, ko);
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static remove (where, options = {}) {
    return new Promise((ok, ko) => {
      try {
        if ( ! ( 'limit' in options ) ) {
          options.limit = 0;
        }

        this
          .find(where, options)
          .then(
            docs => {
              try {
                let promises = docs.map(doc => doc.remove());
                Promise.all(promises).then(
                  () => ok(docs),
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

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static removeOne (where, options = {}) {
    return new Promise((ok, ko) => {
      try {
        this
          .findOne(where, options)
          .then(
            doc => {
              try {
                doc.remove().then(
                  () => ok(doc),
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

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static updateById (id, set) {
    return new Promise((ok, ko) => {
      try {
        this
          .findById(id)
          .then(
            doc => {
              try {
                if ( ! doc ) {
                  throw new Error(`No ${this.name} found with id ${id}`);
                }
                doc.set(set);
                doc.save()
                  .then(ok, ko);
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

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static update(where, set) {
    return new Promise((ok, ko) => {
      try {
        this
          .find(where)
          .then(
            docs => {
              try {
                let promises = docs.map(doc => new Promise((ok, ko) => {
                  try {
                    doc
                      .set(set);
                    doc.save()
                      .then(ok, ko);
                  }
                  catch ( error ) {
                    ko(error);
                  }
                }));
                Promise.all(promises).then(ok, ko);
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

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static toCollectionName () {
    if ( this.collection ) {
      return this.collection;
    }

    return Mung.pluralize(this.name).toLowerCase();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static stream (rows = 100, filter = {}) {

    const { Streamable } = Mung;

    let stream = new Streamable();

    process.nextTick(() => {
      this
        .count(filter)
        .then(
          count => {
            if ( ! count ) {
              stream.add();
              stream.end();
              return;
            }

            let pages = Math.ceil(count/rows);

            let done = 0;

            for (  let i = 0; i < pages ; i ++ ) {
              let page = i + 1;

              this.find(filter, { limit : rows, skip : (page * rows - rows) }).then(
                docs => {
                  stream.add(...docs);

                  done ++;

                  if ( done === pages ) {
                    stream.end();
                  }
                },
                error => stream.emit('error', error)
              );
            }
          },
          error => stream.emit('error', error)
        );
    });

    return stream;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static migrate () {
    return new Promise((ok, ko) => {
      try {
        let { migrations } = this;

        if ( migrations ) {
          let migrate = cb => {
            let version = versions[cursor];

            if ( migrations[version] ) {

              migrations[version].do.apply(this)
                .then(
                  () => {
                    this
                      .find({ __V : { $lt : version } }, { limit : 0 })
                      .then(
                        documents => {
                          Promise
                            .all(
                              documents.map(document => new Promise((ok, ko) => {
                                document.set('__V', version).save().then(ok, ko)
                              }))
                            )
                            .then(
                              () => {
                                cursor ++;
                                migrate(cb);
                              },
                              ko
                            );
                        },
                        ko
                      );
                  },
                  ko
                );
            }
            else {
              cb();
            }
          };

          let versions = Object.keys(migrations);

          let cursor = 0;

          migrate(() => {
            this.buildIndexes().then(ok, ko);
          });
        }
        else {
          this.buildIndexes().then(ok, ko);
        }
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static buildIndexes () {
    return new Promise((ok, ko) => {
      try {
        const { Query } = Mung;

        const query = new Query({ model : this });

        query
          .collection()
          .then(
            collection => {
              try {
                query
                  .ensureIndexes(collection)
                  .then(ok, ko);
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

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

Mung.Model = Model;
