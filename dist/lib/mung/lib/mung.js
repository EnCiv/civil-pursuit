'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _events = require('events');

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var Mung = (function () {
  function Mung() {
    _classCallCheck(this, Mung);
  }

  _createClass(Mung, null, [{
    key: 'validate',
    value: function validate(value, type) {
      var _this = this;

      var convert = arguments[2] === undefined ? false : arguments[2];

      if (Array.isArray(type)) {
        if (!Array.isArray(value)) {
          return false;
        }

        if (type.length === 1) {
          return value.map(function (value) {
            return _this.validate(value, type[0], convert);
          }).every(function (value) {
            return value;
          });
        } else if (value.length !== type.length) {
          return false;
        } else {
          return value.map(function (value, index) {
            return _this.validate(value, type[index], convert);
          }).every(function (value) {
            return value;
          });
        }
      }

      if (type === String) {
        type = _String;
      } else if (type === Number) {
        type = _Number;
      } else if (type === Boolean) {
        type = _Boolean;
      } else if (type === Object) {
        type = _Object;
      } else if (type === Date) {
        type = _Date;
      }

      if (!type) {
        throw new Error('Type not found');
      }

      if (convert && type.convert) {
        value = type.convert(value);
      }

      if (typeof type.validate !== 'function') {
        throw new Error('Missing type validation for type ' + type);
      }

      return type.validate(value);
    }
  }, {
    key: 'convert',
    value: function convert(value, type) {
      var _this2 = this;

      // console.log('------------------')
      // console.log('converting', value, type);
      // console.log('------------------')

      if (Array.isArray(type)) {
        if (!Array.isArray(value)) {
          throw new MungError('Can not convert a non-array to an array of types', { value: value, type: type });
        }

        if (type.length === 1) {
          return value.map(function (value) {
            return _this2.convert(value, type[0]);
          });
        } else {
          return value.filter(function (value, index) {
            return type[index];
          }).map(function (value, index) {
            return _this2.convert(value, type[index]);
          });
        }
      }

      if (type === String) {
        type = _String;
      } else if (type === Number) {
        type = _Number;
      } else if (type === Boolean) {
        type = _Boolean;
      } else if (type === Object) {
        type = _Object;
      } else if (type === Date) {
        type = _Date;
      }

      if (!type.convert) {
        return value;
      }

      return type.convert(value);
    }
  }, {
    key: 'set',
    value: function set(document, key, value, type) {
      var doc = document;

      key.split(/\./).reduce(function (doc, bit, i, bits) {
        if (bits[i + 1]) {
          doc[bit] = doc[bit] || {};
          if (!/^\d+$/.test(bit)) {
            type = type[bit];
          } else {
            type = type[0];
          }
        } else {
          type = type[bit];
          var casted = cast(value, type);
          if (typeof casted !== 'undefined') {
            doc[bit] = casted;
          }
        }
        return doc[bit];
      }, doc);

      return document;
    }
  }, {
    key: 'pluralize',
    value: function pluralize(name) {
      return name + 's';
    }
  }, {
    key: 'embed',
    value: function embed(document) {
      return { type: document };
    }
  }, {
    key: 'runSequence',
    value: function runSequence() {
      var pipeline = arguments[0] === undefined ? [] : arguments[0];
      var locals = arguments[1] === undefined ? {} : arguments[1];

      return new Promise(function (ok, ko) {
        try {
          (function () {
            var cursor = 0;

            var run = function run() {
              try {
                if (pipeline[cursor]) {
                  pipeline[cursor](locals).then(function () {
                    try {
                      cursor++;
                      run();
                    } catch (error) {
                      ko(error);
                    }
                  }, ko);
                } else {
                  ok();
                }
              } catch (error) {
                ko(error);
              }
            };

            run();
          })();
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'parse',
    value: function parse(query, schema) {
      var _this3 = this;

      var parsed = {};

      if (Array.isArray(query)) {
        return this.parse({ $or: query }, schema);
      }

      var _loop = function (field) {

        // field has dot notation

        if (/\./.test(field)) {
          var primaryField = field.split(/\./)[0];

          var type = schema[primaryField];

          if (Array.isArray(type)) {
            parsed[field] = Mung.convert([query[field]], type)[0];
          }
        }

        // If operator to an array ($or, $and, etc.)

        else if (['$or', '$and'].indexOf(field) > -1) {
          parsed[field] = query[field].map(function (value) {
            return _this3.parse(value, schema);
          });
        } else if (Array.isArray(schema[field])) {
          parsed[field] = Mung.convert(query[field], schema[field][0]);
        }

        // query[field] is an object

        else if (typeof query[field] === 'object' && schema[field] !== Object) {

          // query[field].$in

          if ('$in' in query[field]) {
            parsed[field] = {
              $in: query[field].$in.map(function (value) {
                return Mung.convert(value, schema[field]);
              })
            };
          }

          // query[field].$exists

          else if ('$exists' in query[field]) {
            parsed[field] = {
              $exists: query[field].$exists
            };
          } else {
            parsed[field] = Mung.convert(query[field], schema[field]);
          }
        } else {
          parsed[field] = Mung.convert(query[field], schema[field]);
        }
      };

      for (var field in query) {
        _loop(field);
      }

      return parsed;
    }
  }, {
    key: 'process',
    value: function process(query, schema) {
      var _loop2 = function (field) {

        if (query[field] instanceof RegExp) {} else if (field === '$or' || field === '$and') {
          query[field] = query[field].map(function (value) {
            return parse(value, schema);
          });
        } else if (field === '$size' || field === '$exists') {} else if (field === '$push') {
          query[field] = parse(query.$push, schema);
        } else if (/\./.test(field)) {
          schema = field.split(/\./).reduce(function (schema, bit, i, bits) {
            schema = schema[bit];

            if (Array.isArray(schema)) {
              schema = schema[0];
            }
            return schema;
          }, schema);

          query[field] = cast(query[field], schema);
        } else if (Array.isArray(schema[field]) && !Array.isArray(query[field])) {
          if (query[field] instanceof RegExp) {} else if (typeof query[field] === 'object' && query[field].constructor === Object) {
            if ('$ne' in query[field]) {
              query[field].$ne = parse(query[field].$ne, schema[field]);
            } else {
              query[field] = parse(query[field], schema[field][0]);
            }
          } else {
            query[field] = cast([query[field]], schema[field])[0];
          }
        } else if (query[field] instanceof RegExp) {} else if (typeof query[field] === 'object') {
          if ('$in' in query[field]) {
            query[field].$in = query[field].$in.map(function (value) {
              return cast(value, schema[field]);
            });
          } else if ('$lt' in query[field]) {
            query[field].$lt = cast(query[field].$lt, schema[field]);
          } else if ('$lte' in query[field]) {
            query[field].$lte = cast(query[field].$lte, schema[field]);
          } else if ('$gt' in query[field]) {
            query[field].$gt = cast(query[field].$gt, schema[field]);
          } else if ('$gte' in query[field]) {
            query[field].$gte = cast(query[field].$gte, schema[field]);
          } else if ('$exists' in query[field]) {} else if ('$ne' in query[field]) {} else {
            query[field] = cast(query[field], schema[field]);
          }
        } else {
          query[field] = cast(query[field], schema[field]);
        }
      };

      for (var field in query) {
        _loop2(field);
      }
      return query;
    }
  }]);

  return Mung;
})();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Mung.events = new _events.EventEmitter();

Mung.ObjectID = _mongodb2['default'].ObjectID;

Mung.ObjectID.convert = function (id) {
  if (typeof id === 'string') {
    return _mongodb2['default'].ObjectID(id);
  }

  if (id instanceof _mongodb2['default'].ObjectID) {
    return id;
  }

  if (id && typeof id === 'object') {
    if (id.$in) {
      return { $in: id.$in.map(function (id) {
          return Mung.ObjectID.convert(id);
        }) };
    }

    if (id._id) {
      return _mongodb2['default'].ObjectID(id._id);
    }
  }
};

Mung.ObjectID.equal = function (a, b) {
  return a.equals(b);
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var _String = (function () {
  function _String() {
    _classCallCheck(this, _String);
  }

  _createClass(_String, null, [{
    key: 'validate',
    value: function validate(value) {
      return typeof value === 'string';
    }
  }, {
    key: 'convert',
    value: function convert(value) {
      return String(value);
    }
  }]);

  return _String;
})();

Mung.String = _String;

var _Number = (function () {
  function _Number() {
    _classCallCheck(this, _Number);
  }

  _createClass(_Number, null, [{
    key: 'validate',
    value: function validate(value) {
      return value.constructor === Number && isFinite(value);
    }
  }, {
    key: 'convert',
    value: function convert(value) {
      return +value;
    }
  }]);

  return _Number;
})();

Mung.Number = _Number;

var _Boolean = (function () {
  function _Boolean() {
    _classCallCheck(this, _Boolean);
  }

  _createClass(_Boolean, null, [{
    key: 'validate',
    value: function validate(value) {
      return typeof value === 'boolean';
    }
  }, {
    key: 'convert',
    value: function convert(value) {
      return !!value;
    }
  }]);

  return _Boolean;
})();

Mung.Boolean = _Boolean;

var _Object = (function () {
  function _Object() {
    _classCallCheck(this, _Object);
  }

  _createClass(_Object, null, [{
    key: 'validate',
    value: function validate(value) {
      return typeof value === 'object' && value !== null && !Array.isArray(value);
    }
  }]);

  return _Object;
})();

Mung.Object = _Object;

var _Mixed = (function () {
  function _Mixed() {
    _classCallCheck(this, _Mixed);
  }

  _createClass(_Mixed, null, [{
    key: 'validate',
    value: function validate(value) {
      return true;
    }
  }]);

  return _Mixed;
})();

Mung.Mixed = _Mixed;

var _Date = (function () {
  function _Date() {
    _classCallCheck(this, _Date);
  }

  _createClass(_Date, null, [{
    key: 'validate',
    value: function validate(value) {
      return value instanceof Date;
    }
  }, {
    key: 'convert',
    value: function convert(value) {
      return new Date(value);
    }
  }]);

  return _Date;
})();

Mung.Date = _Date;

var _Geo = (function () {
  function _Geo() {
    _classCallCheck(this, _Geo);
  }

  _createClass(_Geo, null, [{
    key: 'validate',
    value: function validate(value) {}
  }]);

  return _Geo;
})();

Mung.Geo = _Geo;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var ExtendableError = (function (_Error) {
  function ExtendableError(message) {
    _classCallCheck(this, ExtendableError);

    _get(Object.getPrototypeOf(ExtendableError.prototype), 'constructor', this).call(this, message);
    this.name = this.constructor.name;
    this.message = message;
    Error.captureStackTrace(this, this.constructor.name);
  }

  _inherits(ExtendableError, _Error);

  return ExtendableError;
})(Error);

var MungError = (function (_ExtendableError) {
  function MungError(message) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, MungError);

    var msg = undefined;

    try {
      msg = JSON.stringify({ message: message, options: options }, null, 2);
    } catch (e) {
      msg = message;
    } finally {
      _get(Object.getPrototypeOf(MungError.prototype), 'constructor', this).call(this, msg);
    }

    this.originalMessage = message;

    if ('code' in options) {
      this.code = options.code;
    }

    this.options = options;
  }

  _inherits(MungError, _ExtendableError);

  return MungError;
})(ExtendableError);

Mung.Error = MungError;

MungError.MISSING_REQUIRED_FIELD = 1;
MungError.DISTINCT_ARRAY_CONSTRAINT = 2;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

exports['default'] = Mung;

// Mung.Model = function () {
//
// }
//
// class Message extends Mung.Model {}
// class Room extends Mung.Model {}
// class User extends Mung.Model {}
//
//
// parse(
//
//   { foo : { $lt : require('moment')().subtract(2, 'minutes').toISOString() } },
//
//   {
//     foo : Date
//   }
//
// )
//
// ,
// { depth: 15 }));
module.exports = exports['default'];

// query[field].$exists