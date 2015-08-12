'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var Harmony = (function (_React$Component) {
  function Harmony(props) {
    _classCallCheck(this, Harmony);

    _get(Object.getPrototypeOf(Harmony.prototype), 'constructor', this).call(this, props);

    this.get();
  }

  _inherits(Harmony, _React$Component);

  _createClass(Harmony, [{
    key: 'get',
    value: function get() {
      if (typeof window !== 'undefined') {
        var harmony = this.props.item.type.harmony;

        // window.socket.emit('get items', { type : this.props.item.subtype._id, parent : this.props.item._id })
        //   .on('OK get items', (panel, items) => {
        //     if ( panel.type._id === this.props.item.subtype._id ) {
        //       console.log({ subtype: { panel, items} })
        //     }
        //     // if ( evaluation.items)
        //   })
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'section',
        { className: 'harmony text-center' },
        _react2['default'].createElement(
          'h1',
          null,
          'Harmony'
        )
      );
    }
  }]);

  return Harmony;
})(_react2['default'].Component);

exports['default'] = Harmony;
module.exports = exports['default'];