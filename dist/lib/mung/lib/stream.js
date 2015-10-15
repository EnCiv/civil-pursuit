'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _stream = require('stream');

var _mung = require('./mung');

var _mung2 = _interopRequireDefault(_mung);

var Streamable = (function (_Readable) {
  function Streamable(options) {
    _classCallCheck(this, Streamable);

    _get(Object.getPrototypeOf(Streamable.prototype), 'constructor', this).call(this, {
      encoding: 'utf8'
    });

    this.setEncoding('utf8');

    this.collection = [];
  }

  _inherits(Streamable, _Readable);

  _createClass(Streamable, [{
    key: '_read',
    value: function _read(n) {
      console.log('reading');
    }
  }, {
    key: 'add',
    value: function add() {
      for (var _len = arguments.length, doc = Array(_len), _key = 0; _key < _len; _key++) {
        doc[_key] = arguments[_key];
      }

      console.log('adding', doc.length);
      // this.collection.push(...doc);
      this.resume();
      this.emit('readable');

      doc.map(function (doc) {
        return doc.toJSON();
      });

      var source = JSON.stringify(doc);

      console.log(source);
      this.emit('data', source);
    }
  }, {
    key: 'end',
    value: function end() {
      this.emit('end');
    }
  }]);

  return Streamable;
})(_stream.Readable);

_mung2['default'].Streamable = Streamable;