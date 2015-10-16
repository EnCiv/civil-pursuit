'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _mung = require('./mung');

var _mung2 = _interopRequireDefault(_mung);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var Model = (function () {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function Model() {
    var document = arguments[0] === undefined ? {} : arguments[0];
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Model);

    var schema = this.constructor.getSchema();

    Object.defineProperties(this, {
      __document: {
        value: {}
      },

      __schema: {
        value: schema
      },

      __types: {
        value: this.parseTypes(schema)
      },

      __indexes: {
        value: this.parseIndexes(schema)
      },

      __defaults: {
        value: this.parseDefaults(schema)
      },

      __required: {
        value: this.parseRequired(schema)
      },

      __private: {
        value: this.parsePrivate(schema)
      },

      __distinct: {
        value: this.parseDistinct(schema)
      }
    });

    if (options._id && !document._id) {
      document._id = _mung2['default'].ObjectID();
    }

    var original = {};

    for (var field in document) {
      this.set(field, document[field]);
      original[field] = document[field];
    }

    Object.defineProperty(this, '__original', {
      value: original
    });

    if (this._id) {
      Object.defineProperty(this, '__timeStamp', {
        value: this._id.getTimestamp()
      });
    }
  }

  _createClass(Model, [{
    key: 'parseIndexes',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function parseIndexes(schema) {
      var _this = this;

      var ns = arguments[1] === undefined ? '' : arguments[1];

      var indexes = [];

      var _loop = function (field) {

        var fields = {};

        var options = {};

        var fieldName = ns ? '' + ns + '.' + field : field;

        if (Array.isArray(schema[field])) {
          var subindexes = _this.parseIndexes(schema[field][0], fieldName);
          indexes.push.apply(indexes, _toConsumableArray(subindexes));
        } else if (typeof schema[field] === 'object') {
          if (schema[field].index || schema[field].unique) {
            var index = schema[field].index || schema[field].unique;

            if (index === true) {
              fields[fieldName] = 1;

              options.name = '' + fieldName + '_1';
            } else if (typeof index === 'string') {
              fields[fieldName] = index;

              options.name = '' + fieldName + '_' + index;
            } else if (Array.isArray(index)) {
              (function () {
                fields[fieldName] = 1;

                var names = ['' + fieldName + '_1'];

                index.forEach(function (field) {
                  fields[field] = 1;
                  names.push('' + field + '_1');
                });

                options.name = names.join('_');
              })();
            } else if (typeof index === 'object') {
              (function () {
                fields[fieldName] = index.sort || 1;

                var names = ['' + fieldName + '_1'];

                if (Array.isArray(index.fields)) {
                  index.fields.forEach(function (field) {
                    fields[field] = 1;
                    names.push('' + field + '_1');
                  });
                } else if (typeof index.fields === 'object') {
                  for (var f in index.fields) {
                    fields[f] = index.fields[f];
                    names.push('' + f + '_' + index.fields[f]);
                  }
                }

                for (var option in index) {
                  if (option !== 'sort' && option !== 'fields') {
                    options[option] = index[option];
                  }
                }

                if (!options.name) {
                  options.name = names.join('_');
                }
              })();
            }

            indexes.push([fields, options]);
          }

          if (typeof schema[field].type === 'object') {
            var subindexes = _this.parseIndexes(schema[field].type, fieldName);
            indexes.push.apply(indexes, _toConsumableArray(subindexes));
          }
        }
      };

      for (var field in schema) {
        _loop(field);
      }

      return indexes;
    }
  }, {
    key: 'parseDefaults',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function parseDefaults(schema) {
      var ns = arguments[1] === undefined ? '' : arguments[1];

      var defaults = {};

      for (var field in schema) {

        var fieldName = ns ? '' + ns + '.' + field : field;

        if (Array.isArray(schema[field])) {

          var subdefaults = this.parseDefaults(schema[field][0], fieldName);

          if (Object.keys(subdefaults).length) {
            defaults[field] = {};

            for (var subdefault in subdefaults) {
              defaults[field][subdefault] = subdefaults[subdefault];
            }
          }
        } else if (typeof schema[field] === 'object') {
          if ('default' in schema[field]) {
            defaults[field] = schema[field]['default'];
          }

          if (typeof schema[field].type === 'object') {
            var subdefaults = this.parseDefaults(schema[field].type, fieldName);

            if (Object.keys(subdefaults).length) {
              defaults[field] = {};

              for (var subdefault in subdefaults) {
                defaults[field][subdefault] = subdefaults[subdefault];
              }
            }
          }
        }
      }

      return defaults;
    }
  }, {
    key: 'parseRequired',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function parseRequired(schema) {
      var required = {};

      for (var field in schema) {

        if (Array.isArray(schema[field])) {
          var subrequired = this.parseRequired(schema[field][0]);

          if (Object.keys(subrequired).length) {
            required[field] = {};

            for (var subreq in subrequired) {
              required[field][subreq] = subrequired[subreq];
            }
          }
        } else if (typeof schema[field] === 'object') {
          if (schema[field].required) {
            required[field] = true;
          }

          if (typeof schema[field].type === 'object') {
            var subrequired = this.parseRequired(schema[field].type);

            if (Object.keys(subrequired).length) {
              required[field] = {};

              for (var subreq in subrequired) {
                required[field][subreq] = subrequired[subreq];
              }
            }
          }
        }
      }

      return required;
    }
  }, {
    key: 'parsePrivate',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function parsePrivate(schema) {
      var _private = {};

      for (var field in schema) {

        if (Array.isArray(schema[field])) {
          var subprivate = this.parsePrivate(schema[field][0]);

          if (Object.keys(subprivate).length) {
            _private[field] = {};

            for (var _subpriv in subprivate) {
              _private[field][_subpriv] = subprivate[_subpriv];
            }
          }
        } else if (typeof schema[field] === 'object') {
          if (schema[field]['private']) {
            _private[field] = true;
          }

          if (typeof schema[field].type === 'object') {
            var subprivate = this.parsePrivate(schema[field].type);

            if (Object.keys(subprivate).length) {
              _private[field] = {};

              for (var _subpriv2 in subprivate) {
                _private[field][_subpriv2] = subprivate[_subpriv2];
              }
            }
          }
        }
      }

      return _private;
    }
  }, {
    key: 'parseDistinct',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function parseDistinct(schema) {
      var distinct = {};

      for (var field in schema) {

        if (Array.isArray(schema[field])) {
          var subdistinct = this.parseDistinct(schema[field][0]);

          if (Object.keys(subdistinct).length) {
            distinct[field] = {};

            for (var sub in subdistinct) {
              distinct[field][sub] = subdistinct[sub];
            }
          }
        } else if (typeof schema[field] === 'object') {
          if (schema[field].distinct) {
            distinct[field] = true;
          }

          if (typeof schema[field].type === 'object') {
            var subdistinct = this.parseDistinct(schema[field].type);

            if (Object.keys(subdistinct).length) {
              distinct[field] = {};

              for (var sub in subdistinct) {
                distinct[field][sub] = subdistinct[subpriv];
              }
            }
          }
        }
      }

      return distinct;
    }
  }, {
    key: 'parseTypes',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function parseTypes(schema) {
      var types = {};

      for (var field in schema) {
        if (typeof schema[field] === 'function') {
          types[field] = schema[field];
        } else if (Array.isArray(schema[field])) {
          if (typeof schema[field][0] === 'function') {
            types[field] = [schema[field][0]];
          } else {
            types[field] = [this.parseTypes(schema[field][0])];
          }
        } else if (typeof schema[field] === 'object') {
          if (typeof schema[field].type === 'function') {
            types[field] = schema[field].type;
          } else if (Array.isArray(schema[field].type)) {
            if (typeof schema[field].type[0] === 'function') {
              types[field] = [schema[field].type[0]];
            } else {
              types[field] = [this.parseTypes(schema[field].type[0])];
            }
          } else if (typeof schema[field].type === 'object') {
            types[field] = this.parseTypes(schema[field].type);
          }
        }
      }

      return types;
    }
  }, {
    key: 'set',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function set(field, value) {
      var _this2 = this;

      if (typeof field === 'object') {
        for (var _field in field) {
          this.set(_field, field[_field]);
        }
        return this;
      }

      if (typeof value === 'function') {
        value = value();
      }

      if (field === '$push') {
        var array = Object.keys(value)[0];
        return this.push(array, value[array]);
      }

      if (!(field in this.__schema)) {
        return this;
      }

      if (value === null) {
        this.__document[field] = null;
      } else {
        this.__document[field] = _mung2['default'].convert(value, this.__types[field]);
      }

      var _loop2 = function (_field2) {
        if (!(_field2 in _this2)) {
          Object.defineProperty(_this2, _field2, {
            enumerable: true,
            configurable: true,
            get: function get() {
              return _this2.__document[_field2];
            }
          });
        }
      };

      for (var _field2 in this.__document) {
        _loop2(_field2);
      }

      return this;
    }
  }, {
    key: 'verifyRequired',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function verifyRequired() {
      for (var field in this.__required) {
        if (!(field in this.__document)) {
          throw new _mung2['default'].Error('Missing field ' + field, { code: _mung2['default'].Error.MISSING_REQUIRED_FIELD });
        }
      }
    }
  }, {
    key: 'applyDefault',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function applyDefault() {
      var _this3 = this;

      var _loop3 = function (field) {
        if (!(field in _this3.__document)) {
          var _default = undefined;

          if (typeof _this3.__defaults[field] === 'function') {
            _default = _this3.__defaults[field]();
          } else {
            _default = _this3.__defaults[field];
          }

          _this3.__document[field] = _default;

          Object.defineProperty(_this3, field, {
            enumerable: true,
            configurable: true,
            get: function get() {
              return _this3.__document[field];
            }
          });
        }
      };

      for (var field in this.__defaults) {
        _loop3(field);
      }
    }
  }, {
    key: 'push',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function push(field, value) {
      if (!(field in this)) {
        this.set(field, []);
      }

      if (!Array.isArray(this[field])) {
        throw new Error('' + this.constructor.name + '.' + field + ' is not an array');
      }

      var type = this.__types[field][0];

      var casted = _mung2['default'].convert(value, type);

      if (typeof casted !== 'undefined') {

        if (this.__distinct[field]) {
          var exists = this[field].some(function (item) {
            if (type.equal) {
              return type.equal(item, casted);
            }
            return item === casted;
          });

          if (exists) {
            throw new _mung2['default'].Error('Array only accepts distinct values', {
              code: _mung2['default'].Error.DISTINCT_ARRAY_CONSTRAINT,
              rejected: casted
            });
          }
        }

        this.__document[field].push(casted);
      }

      return this;
    }
  }, {
    key: 'filter',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function filter(field, _filter) {
      if (Array.isArray(this.__document[field])) {
        this.__document[field] = this.__document[field].filter(_filter);
      }
    }
  }, {
    key: 'increment',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function increment(field) {
      var step = arguments[1] === undefined ? 1 : arguments[1];

      if (typeof field === 'object') {
        for (var _field in field) {
          this.increment(_field, field[_field]);
        }
        return this;
      }

      if (!this[field]) {
        this[field] = 0;
      }

      this[field] += step;

      return this.set(field, this[field]);
    }
  }, {
    key: 'unset',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function unset(field) {
      delete this.__document[field];

      return this;
    }
  }, {
    key: 'prepare',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function prepare(operation) {
      var _this4 = this;

      var options = arguments[1] === undefined ? {} : arguments[1];

      return new Promise(function (ok, ko) {
        try {
          if (!('__v' in _this4)) {
            _this4.__document.__v = 0;

            Object.defineProperty(_this4, '__v', {
              enumerable: true,
              configurable: true,
              get: function get() {
                return _this4.__document.__v;
              }
            });
          }

          if (!('__V' in _this4)) {
            _this4.__document.__V = _this4.constructor.version || 0;

            Object.defineProperty(_this4, '__V', {
              enumerable: true,
              configurable: true,
              get: function get() {
                return _this4.__document.__V;
              }
            });
          }

          var beforeValidation = [];

          if (typeof _this4.constructor.validating === 'function') {
            beforeValidation = _this4.constructor.validating();
          }

          _mung2['default'].runSequence(beforeValidation, _this4).then(function () {
            try {
              _this4.applyDefault();

              _this4.verifyRequired();

              var before = [];

              if (operation === 'insert' && typeof _this4.constructor.inserting === 'function') {
                before = _this4.constructor.inserting();
              }

              _mung2['default'].runSequence(before, _this4).then(ok, ko);
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'save',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function save() {
      var _this5 = this;

      var options = arguments[0] === undefined ? {} : arguments[0];

      return new Promise(function (ok, ko) {
        try {
          (function () {
            var started = Date.now();

            if (!_this5.__document._id || options.create) {
              _this5.prepare('insert', options).then(function () {
                try {
                  var Query = _mung2['default'].Query;

                  new Query({ model: _this5.constructor }).insert(_this5.__document).then(function (created) {
                    try {
                      _this5.__document._id = created.insertedId;

                      Object.defineProperty(_this5, '__queryTime', {
                        enumerable: false,
                        writable: false,
                        value: created.__queryTime
                      });

                      if (!('__timeStamp' in _this5)) {
                        Object.defineProperty(_this5, '__timeStamp', {
                          enumerable: false,
                          writable: false,
                          value: created.insertedId.getTimestamp()
                        });
                      }

                      if (!('_id' in _this5)) {
                        Object.defineProperty(_this5, '_id', {
                          enumerable: true,
                          writable: false,
                          value: _this5.__document._id
                        });
                      }

                      if (typeof _this5.constructor.inserted === 'function') {
                        var pipe = _this5.constructor.inserted();

                        if (Array.isArray(pipe)) {
                          _mung2['default'].runSequence(pipe, _this5).then(function () {
                            Object.defineProperty(_this5, '__totalQueryTime', {
                              enumerable: false,
                              writable: false,
                              value: Date.now() - started
                            });

                            ok(_this5);
                          }, ko);
                        }
                      } else {
                        Object.defineProperty(_this5, '__totalQueryTime', {
                          enumerable: false,
                          writable: false,
                          value: Date.now() - started
                        });

                        ok(_this5);
                      }
                    } catch (error) {
                      ko(error);
                    }
                  }, ko);
                } catch (error) {
                  ko(error);
                }
              }, ko);
            } else {
              if (!('__v' in _this5.__document)) {
                _this5.__document.__v = 0;

                Object.defineProperty(_this5, '__v', {
                  enumerable: true,
                  configurable: true,
                  get: function get() {
                    return _this5.__document.__v;
                  }
                });
              }

              _this5.__document.__v++;

              if (!('__V' in _this5.__document)) {
                _this5.__document.__V = _this5.constructor.version || 0;

                Object.defineProperty(_this5, '__V', {
                  enumerable: true,
                  configurable: true,
                  get: function get() {
                    return _this5.__document.__V;
                  }
                });
              }

              var updating = [];

              if (typeof _this5.constructor.updating === 'function') {
                updating = updating.concat(_this5.constructor.updating());
              }

              _this5.applyDefault();

              _mung2['default'].runSequence(updating, _this5).then(function () {
                try {
                  var Query = _mung2['default'].Query;

                  new Query({ model: _this5.constructor }).insert(_this5.__document, _this5.__document._id).then(function (created) {
                    try {

                      if (typeof _this5.constructor.updated === 'function') {
                        var pipe = _this5.constructor.updated();

                        if (Array.isArray(pipe)) {

                          _mung2['default'].runSequence(pipe, _this5).then(function () {
                            return ok(_this5);
                          }, ko);
                        } else {
                          ok(_this5);
                        }
                      } else {
                        ok(_this5);
                      }
                    } catch (error) {
                      ko(error);
                    }
                  }, ko);
                } catch (error) {
                  ko(error);
                }
              }, ko);
            }
          })();
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'remove',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function remove() {
      var _this6 = this;

      return new Promise(function (ok, ko) {
        try {
          (function () {
            var model = _this6.constructor;
            var schema = model.schema;

            if (typeof schema === 'function') {
              schema = schema();
            }

            var removing = [];

            if (typeof model.removing === 'function') {
              var pipe = model.removing();

              if (Array.isArray(pipe)) {
                removing = removing.concat(pipe);
              }
            }

            _mung2['default'].runSequence(removing, _this6).then(function () {
              try {
                var Query = _mung2['default'].Query;

                new Query({ model: model }).remove({ _id: _this6._id }, { one: true }).then(function () {
                  try {
                    ok(_this6.__document);

                    if (typeof model.removed === 'function') {
                      var pipe = model.removed();

                      if (Array.isArray(pipe)) {
                        _mung2['default'].runSequence(pipe, _this6);
                      }
                    }
                  } catch (error) {
                    ko(error);
                  }
                }, ko);
              } catch (error) {
                ko(error);
              }
            }, ko);
          })();
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'toJSON',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function toJSON() {
      var options = arguments[0] === undefined ? {} : arguments[0];

      var json = {};

      for (var key in this.__document) {
        if (this.__document[key] instanceof _mongodb2['default'].ObjectID) {
          json[key] = this.__document[key].toString();
        } else if (!this.__private[key]) {
          json[key] = this.__document[key];
        }
      }

      if (options.timeStamp || options.timestamp) {
        json.__timeStamp = this.__timeStamp;
      }

      if (options.populate) {
        for (var field in this.__populated) {
          json[field] = this.__populated[field].toJSON(options);
        }
      }

      return json;
    }
  }, {
    key: 'populate',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function populate() {
      var _this7 = this;

      for (var _len = arguments.length, foreignKeys = Array(_len), _key = 0; _key < _len; _key++) {
        foreignKeys[_key] = arguments[_key];
      }

      return new Promise(function (ok, ko) {
        try {
          (function () {

            var refs = [];

            if (foreignKeys.length) {
              for (var field in _this7.__types) {
                if (foreignKeys.indexOf(field) > -1 && new _this7.__types[field]() instanceof Model) {
                  refs.push({ field: field, model: _this7.__types[field] });
                }
              }
            } else {
              for (var field in _this7.__types) {
                if (new _this7.__types[field]() instanceof Model) {
                  refs.push({ field: field, model: _this7.__types[field] });
                }
              }
            }

            Promise.all(refs.map(function (ref) {
              return ref.model.findById(_this7[ref.field]);
            })).then(function (populated) {
              Object.defineProperty(_this7, '__populated', {
                enumerable: false,
                writable: false,
                value: refs.map(function (ref, index) {
                  ref.document = populated[index];
                  return ref;
                }).reduce(function (populated, ref) {
                  populated[ref.field] = ref.document;
                  return populated;
                }, {})
              });

              ok();
            }, ko);
          })();
        } catch (error) {
          ko(error);
        }
      });
    }
  }], [{
    key: 'convert',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function convert(value) {
      if (value) {
        if (value instanceof _mung2['default'].ObjectID) {
          return value;
        }

        if (value._id) {
          return _mung2['default'].ObjectID(value._id);
        }

        if (typeof value === 'String') {
          return _mung2['default'].ObjectID(value);
        }
      }

      throw new Error('Can not convert value to Model');
    }
  }, {
    key: 'equal',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function equal(a, b) {
      if (a instanceof _mung2['default'].ObjectID) {
        if (b instanceof _mung2['default'].ObjectID) {
          return a.equals(b);
        }
      }
    }
  }, {
    key: 'schema',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function schema() {
      return {};
    }
  }, {
    key: 'getSchema',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function getSchema() {
      var schema = this.schema();

      schema._id = _mung2['default'].ObjectID;

      schema.__v = Number;

      schema.__V = Number;

      return schema;
    }
  }, {
    key: 'find',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function find(document, options) {
      var constructor = this;
      var Query = _mung2['default'].Query;

      if (Array.isArray(document)) {
        document = { $or: document };
      }

      return new Query({ model: this }).find(document, options);
    }
  }, {
    key: 'count',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function count(document, options) {
      var constructor = this;
      var Query = _mung2['default'].Query;

      if (Array.isArray(document)) {
        document = { $or: document };
      }

      return new Query({ model: this }).count(document, options);
    }
  }, {
    key: 'findOne',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function findOne() {
      var where = arguments[0] === undefined ? {} : arguments[0];

      return this.find(where, { one: true });
    }
  }, {
    key: 'findById',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function findById(id) {
      return this.findOne({ _id: id });
    }
  }, {
    key: 'findByIds',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function findByIds() {
      for (var _len2 = arguments.length, ids = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        ids[_key2] = arguments[_key2];
      }

      if (ids.length === 1 && Array.isArray(ids[0])) {
        ids = ids[0];
      }
      return this.find({ _id: { $in: ids } });
    }
  }, {
    key: 'create',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function create(document, options) {
      var _this8 = this;

      return new Promise(function (ok, ko) {
        try {
          if (Array.isArray(document)) {
            return Promise.all(document.map(function (document) {
              return _this8.create(document, options);
            })).then(ok, ko);
          }

          var doc = new _this8(document);
          doc.save(options).then(ok, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'remove',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function remove(where) {
      var _this9 = this;

      var options = arguments[1] === undefined ? {} : arguments[1];

      return new Promise(function (ok, ko) {
        try {
          if (!('limit' in options)) {
            options.limit = 0;
          }

          _this9.find(where, options).then(function (docs) {
            try {
              var promises = docs.map(function (doc) {
                return doc.remove();
              });
              Promise.all(promises).then(function () {
                return ok(docs);
              }, ko);
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'removeOne',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function removeOne(where) {
      var _this10 = this;

      var options = arguments[1] === undefined ? {} : arguments[1];

      return new Promise(function (ok, ko) {
        try {
          _this10.findOne(where, options).then(function (doc) {
            try {
              doc.remove().then(function () {
                return ok(doc);
              }, ko);
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'updateById',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function updateById(id, set) {
      var _this11 = this;

      return new Promise(function (ok, ko) {
        try {
          _this11.findById(id).then(function (doc) {
            try {
              if (!doc) {
                throw new Error('No ' + _this11.name + ' found with id ' + id);
              }
              doc.set(set);
              doc.save().then(ok, ko);
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'increment',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function increment(where, set) {
      var _this12 = this;

      var options = arguments[2] === undefined ? {} : arguments[2];

      return new Promise(function (ok, ko) {
        try {
          if (where instanceof _mung2['default'].ObjectID || typeof where === 'string') {
            where = { _id: where };
          }
          _this12.find(where, options).then(function (docs) {
            try {
              var promises = docs.map(function (doc) {
                return new Promise(function (ok, ko) {
                  try {
                    doc.increment(set).save().then(ok, ko);
                  } catch (error) {
                    ko(error);
                  }
                });
              });
              Promise.all(promises).then(ok, ko);
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'incrementOne',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function incrementOne(where, set) {
      var _this13 = this;

      var options = arguments[2] === undefined ? {} : arguments[2];

      return new Promise(function (ok, ko) {
        try {
          if (where instanceof _mung2['default'].ObjectID || typeof where === 'string') {
            where = { _id: where };
          }
          _this13.findOne(where, options).then(function (doc) {
            try {
              if (!doc) {
                return ok(doc);
              }
              doc = new Promise(function (ok, ko) {
                try {
                  doc.increment(set).save().then(ok, ko);
                } catch (error) {
                  ko(error);
                }
              });
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'updateOne',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function updateOne(where, set) {
      var _this14 = this;

      var options = arguments[2] === undefined ? {} : arguments[2];

      return new Promise(function (ok, ko) {
        try {
          _this14.findOne(where, options).then(function (doc) {
            try {
              if (!doc) {
                return ok(doc);
              }
              doc = new Promise(function (ok, ko) {
                try {
                  doc.set(set).save().then(ok, ko);
                } catch (error) {
                  ko(error);
                }
              });
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'update',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function update(where, set) {
      var _this15 = this;

      var options = arguments[2] === undefined ? {} : arguments[2];

      return new Promise(function (ok, ko) {
        try {
          if (options.one) {
            return updateOne(where, set, options = {});
          }

          _this15.find(where, options).then(function (docs) {
            try {
              var promises = docs.map(function (doc) {
                return new Promise(function (ok, ko) {
                  try {
                    doc.set(set).save().then(ok, ko);
                  } catch (error) {
                    ko(error);
                  }
                });
              });
              Promise.all(promises).then(ok, ko);
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'toCollectionName',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function toCollectionName() {
      if (this.collection) {
        return this.collection;
      }

      return _mung2['default'].pluralize(this.name).toLowerCase();
    }
  }, {
    key: 'stream',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function stream() {
      var _this16 = this;

      var rows = arguments[0] === undefined ? 100 : arguments[0];
      var filter = arguments[1] === undefined ? {} : arguments[1];
      var Streamable = _mung2['default'].Streamable;

      var stream = new Streamable();

      process.nextTick(function () {
        _this16.count(filter).then(function (count) {
          if (!count) {
            stream.add();
            stream.end();
            return;
          }

          var pages = Math.ceil(count / rows);

          var done = 0;

          for (var i = 0; i < pages; i++) {
            var page = i + 1;

            _this16.find(filter, { limit: rows, skip: page * rows - rows }).then(function (docs) {
              stream.add.apply(stream, _toConsumableArray(docs));

              done++;

              if (done === pages) {
                stream.end();
              }
            }, function (error) {
              return stream.emit('error', error);
            });
          }
        }, function (error) {
          return stream.emit('error', error);
        });
      });

      return stream;
    }
  }, {
    key: 'migrate',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function migrate() {
      var _this17 = this;

      return new Promise(function (ok, ko) {
        try {
          (function () {
            var migrations = _this17.migrations;

            if (migrations) {
              (function () {
                var migrate = function migrate(cb) {
                  var version = versions[cursor];

                  if (migrations[version]) {

                    migrations[version]['do'].apply(_this17).then(function () {
                      _this17.find({ __V: { $lt: version } }, { limit: 0 }).then(function (documents) {
                        Promise.all(documents.map(function (document) {
                          return new Promise(function (ok, ko) {
                            document.set('__V', version).save().then(ok, ko);
                          });
                        })).then(function () {
                          cursor++;
                          migrate(cb);
                        }, ko);
                      }, ko);
                    }, ko);
                  } else {
                    cb();
                  }
                };

                var versions = Object.keys(migrations);

                var cursor = 0;

                migrate(function () {
                  _this17.buildIndexes().then(ok, ko);
                });
              })();
            } else {
              _this17.buildIndexes().then(ok, ko);
            }
          })();
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'buildIndexes',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function buildIndexes() {
      var _this18 = this;

      return new Promise(function (ok, ko) {
        try {
          (function () {
            var Query = _mung2['default'].Query;

            var query = new Query({ model: _this18 });

            query.collection().then(function (collection) {
              try {
                query.ensureIndexes(collection).then(ok, ko);
              } catch (error) {
                ko(error);
              }
            }, ko);
          })();
        } catch (error) {
          ko(error);
        }
      });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }]);

  return Model;
})();

_mung2['default'].Model = Model;