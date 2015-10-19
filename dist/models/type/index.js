'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _libMung = require('../../lib/mung');

var _libMung2 = _interopRequireDefault(_libMung);

var _libUtilToSlug = require('../../lib/util/to-slug');

var _libUtilToSlug2 = _interopRequireDefault(_libUtilToSlug);

var _methodsIsHarmony = require('./methods/is-harmony');

var _methodsIsHarmony2 = _interopRequireDefault(_methodsIsHarmony);

var _methodsGetSubtype = require('./methods/get-subtype');

var _methodsGetSubtype2 = _interopRequireDefault(_methodsGetSubtype);

var _migrations2 = require('./migrations/2');

var _migrations22 = _interopRequireDefault(_migrations2);

var Type = (function (_Mung$Model) {
  function Type() {
    _classCallCheck(this, Type);

    if (_Mung$Model != null) {
      _Mung$Model.apply(this, arguments);
    }
  }

  _inherits(Type, _Mung$Model);

  _createClass(Type, [{
    key: 'isHarmony',
    value: function isHarmony() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _methodsIsHarmony2['default'].apply(this, args);
    }
  }, {
    key: 'getSubtype',
    value: function getSubtype() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _methodsGetSubtype2['default'].apply(this, args);
    }
  }, {
    key: 'link',
    get: function () {
      return '/item/' + this.id + '/' + (0, _libUtilToSlug2['default'])(this.subject);
    }
  }], [{
    key: 'schema',
    value: function schema() {
      return {
        'name': {
          type: String,
          unique: true,
          required: true
        },

        'harmony': {
          type: [Type],
          'default': []
        },

        'parent': Type
      };
    }
  }]);

  return Type;
})(_libMung2['default'].Model);

Type.migrations = {
  2: _migrations22['default']
};

exports['default'] = Type;
module.exports = exports['default'];