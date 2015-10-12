'use strict';

import Mung from './mung';
import mongodb from 'mongodb';

class Model {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (document = {}) {
    Object.defineProperty(this, 'document', {
      enumerable : false,
      writable : true,
      value : {}
    });

    const schema = this.constructor.getSchema();

    Object.defineProperty(this, '__types', {
      enumerable : false,
      writable : false,
      value : this.parseTypes(schema)
    });

    Object.defineProperty(this, 'fields', {
      enumerable : false,
      writable : false,
      value : this.parseFields(this.__types, schema)
    });

    Object.defineProperty(this, 'indexes', {
      enumerable : false,
      writable : false,
      value : this.parseIndexes(this.__types, schema)
    });

    let original = {};

    for ( let field in document ) {
      this.set(field, document[field]);
      original[field] = document[field];
    }

    Object.defineProperty(this, '__original', {
      enumerable : false,
      writable : false,
      value : original
    });

    if ( this._id ) {
      Object.defineProperty(this, '__timeStamp', {
        enumerable : false,
        writable : false,
        value : this._id.getTimestamp()
      });
    }

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  parseFields (types, schema) {
    let fields = {};

    for ( let type in types ) {
      fields[type] = {};

      if ( typeof types[type] === 'function' ) {
        if ( schema[type].required ) {
          fields[type].required = true;
        }

        if ( schema[type].private ) {
          fields[type].private = true;
        }

        if ( schema[type].default ) {
          fields[type].default = schema[type].default;
        }
      }

      else if ( Array.isArray(types[type]) ) {
        let _schema = {};

        if ( schema[type].type ) {
          _schema = schema[type].type[0];

          if ( schema[type].required ) {
            fields[type].required = true;
          }

          if ( schema[type].private ) {
            fields[type].private = true;
          }

          if ( schema[type].default ) {
            fields[type].default = schema[type].default;
          }
        }
        else {
          _schema = schema[type][0];
        }

        if ( typeof types[type][0] === 'object' ) {
          let _fields = this.parseFields(types[type][0], _schema);
          for ( let _type in _fields ) {
            fields[`${type}.$.${_type}`] = _fields[_type];
          }
        }

      }
    }

    return fields;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static buildIndex (field, schema, isUnique = false, ns = '') {
    let index = {
      v         :   1,
      unique    :   !! isUnique
    };

    let name = typeof schema === 'string' ? schema : 1;

    if ( Array.isArray(schema) ) {
      let fields = [field].concat(schema);
      index.name = fields.map(field => `${field}_1`).join('_');
      index.key = fields.map(field => {
        let name = '';
        if ( ns ) {
          name = `${ns}.`;
        }
        name += field;
        return { [name] : 1 };
      });
    }

    else if ( typeof schema === 'object' ) {
      let fields = [field].concat(schema.compound);
      index.name = fields.map(field => `${field}_1`).join('_');
      index.key = fields.map(field => {
        let name = '';
        if ( ns ) {
          name = `${ns}.`;
        }
        name += field;
        return { [name] : 1 };
      });

      if ( schema.force ) {
        index.force = true;
      }
    }

    else if ( ns ) {
      index.name  =   `${ns}.${field}_${name}`;
      index.key   =   { [`${ns}.${field}`] : name };
    }

    else {
      index.name  =   `${field}_${name}`;
      index.key   =   { [field] : name };
    }

    return index;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  parseIndexes (types, schema, ns='') {
    let indexes = [];

    for ( let type in types ) {
      if ( typeof types[type] === 'function' ) {
        if ( schema[type].index ) {
          indexes.push(this.constructor.buildIndex(type, schema[type].index, false, ns));
        }

        if ( schema[type].unique ) {
          indexes.push(this.constructor.buildIndex(type, schema[type].unique, true, ns));
        }
      }

      else if ( Array.isArray(types[type]) ) {
        let _schema = {};

        if ( schema[type].type ) {
          _schema = schema[type].type[0];

          if ( schema[type].index ) {
            indexes.push(this.constructor.buildIndex(type, schema[type].index, false, ns));
          }

          if ( schema[type].unique ) {
            indexes.push(this.constructor.buildIndex(type, schema[type].unique, true, ns));
          }
        }
        else {
          _schema = schema[type][0];
        }

        if ( typeof types[type][0] === 'object' ) {
          let _indexes = this.parseIndexes(types[type][0], _schema, type);
          indexes.push(..._indexes);
        }
      }
    }

    return indexes;
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

    this.document = Mung.set(this.document, field, value, this.__types);

    for ( let field in this.document ) {
      if ( ! ( field in this ) ) {
        Object.defineProperty(this, field, {
          enumerable : true,
          configurable : true,
          get : () => {
            return this.document[field];
          }
        });
      }
    }

    return this;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  verifyRequired () {
    for ( let field in this.fields ) {
      if ( this.fields[field].required ) {
        let value = field.split(/\./).reduce((doc, bit, i, bits) => {

          if ( typeof doc === 'undefined' ) {
            return undefined;
          }

          if ( bit === '$' ) {
            return doc;
          }

          else if ( Array.isArray(doc) ) {
            if ( ! doc.length ) {
              return undefined;
            }

            if ( ! doc.every((item, index) => !!(bit in item)) ) {
              return undefined;
            }

            return true;
          }

          return doc[bit];
        }, this.document);

        if ( typeof value === 'undefined' ) {
          throw new (Mung.Error)(`Missing field ${field}`, { code : Mung.Error.MISSING_REQUIRED_FIELD });
        }
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  applyDefault () {
    for ( let field in this.fields ) {
      if ( 'default' in this.fields[field] ) {
        if ( ! ( field in this.document ) ) {
          this.set(field, this.fields[field].default);
        }
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  push (field, value) {
    if ( ! ( field in this.document  ) ) {
      this.document[field] = [];
    }

    const casted = Mung.cast(value, this.__types[field][0]);

    if ( typeof casted !== 'undefined' ) {
      this.document[field].push(casted);
    }

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  filter (field, filter) {
    if ( Array.isArray(this.document[field]) ) {
      this.document[field] = this.document[field].filter(filter);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  unset (field) {
    delete this.document[field];

    return this;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  save (options = {}) {

    return new Promise((ok, ko) => {
      try {
        this.verifyRequired();

        this.document.__v = 0;

        Object.defineProperty(this, '__v', {
          enumerable : true,
          configurable : true,
          get : () => {
            return this.document.__v;
          }
        });

        if ( ! ( '__V' in this.document ) ) {
          this.document.__V = this.constructor.version || 0;
        }

        Object.defineProperty(this, '__V', {
          enumerable : true,
          configurable : true,
          get : () => {
            return this.document.__V;
          }
        });

        if ( ! this.document._id || options.create ) {
          this.applyDefault();

          let inserting = [];

          if ( typeof this.constructor.inserting === 'function' ) {
            inserting = inserting.concat(this.constructor.inserting());
          }

          Mung.runSequence(inserting, this)
            .then(
              () => {
                try {
                  const { Query } = Mung;
                  new Query({ model : this.constructor })
                    .insert(this.document)
                    .then(
                      created => {
                        try {
                          this.document._id = created.insertedId;

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
                              value : this.document._id
                            });
                          }

                          if ( typeof this.constructor.inserted === 'function' ) {
                            const pipe = this.constructor.inserted();

                            if ( Array.isArray(pipe) ) {
                              Mung.runSequence(pipe, this).then(
                                () => ok(this),
                                ko
                              );

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
        else {
          if ( ! ( '__v' in this.document ) ) {
            this.document.__v = 0;

            Object.defineProperty(this, '__v', {
              enumerable : true,
              configurable : true,
              get : () => {
                return this.document.__v;
              }
            });
          }

          this.document.__v ++;

          if ( ! ( '__V' in this.document ) ) {
            this.document.__V = this.constructor.version || 0;

            Object.defineProperty(this, '__V', {
              enumerable : true,
              configurable : true,
              get : () => {
                return this.document.__V;
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
                    .insert(this.document, this.document._id)
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
                      ok(this.document);

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

  /**
   *  @arg        {Object={}} Set of options
   */

  toJSON (options = {}) {
    let json = {};

    for ( let key in this.document ) {
      if ( this.document[key] instanceof mongodb.ObjectID ) {
        json[key] = this.document[key].toString();
      }
      else if ( ! this.fields[key].private ) {
        json[key] = this.document[key];
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

  populate () {
    return new Promise((ok, ko) => {
      try {
        let refs = [];

        for ( let field in this.__types ) {
          if ( new (this.__types[field])() instanceof Model ) {
            refs.push({ field, model : this.__types[field] });
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

  static schema () {
    return {};
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static getSchema () {
    let schema = this.schema();

    schema._id = mongodb.ObjectID;

    schema.__v = Number;

    schema.__V = Number;

    for ( let field in schema ) {
      if ( typeof schema[field] === 'function' || Array.isArray(schema[field]) ) {
        schema[field] = { type : schema[field] };
      }
    }

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

  static findOne (where) {
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

        if ( ! migrations ) {
          throw new Error('Migrations not found');
        }

        let migrate = () => {
          let version = versions[cursor];

          if ( migrations[version] ) {

            migrations[version].do.apply(this)
              .then(
                () => {
                  this
                    .find({ __V : { $lt : version } }, { limit : 0 })
                    .then(
                      documents => {
                        console.log(`Found ${documents.length} documents older than ${version}`)
                        Promise
                          .all(
                            documents.map(document => new Promise((ok, ko) => {
                              document.set('__V', version).save().then(ok, ko)
                            }))
                          )
                          .then(
                            () => {
                              cursor ++;
                              migrate();
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
            ok();
          }
        };

        let versions = Object.keys(migrations);

        let cursor = 0;

        migrate();
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

Mung.Model = Model;
