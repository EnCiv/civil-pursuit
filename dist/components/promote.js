'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utilRow = require('./util/row');

var _utilRow2 = _interopRequireDefault(_utilRow);

var _utilColumn = require('./util/column');

var _utilColumn2 = _interopRequireDefault(_utilColumn);

var _itemMedia = require('./item-media');

var _itemMedia2 = _interopRequireDefault(_itemMedia);

var _utilLoading = require('./util/loading');

var _utilLoading2 = _interopRequireDefault(_utilLoading);

var Header = (function (_React$Component) {
  function Header() {
    _classCallCheck(this, Header);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Header, _React$Component);

  _createClass(Header, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'header',
        { className: 'promote-steps' },
        _react2['default'].createElement(
          'h2',
          null,
          this.state.cursor,
          ' of ',
          this.state.limit
        ),
        _react2['default'].createElement(
          'h4',
          null,
          'Evaluate each item below'
        )
      );
    }
  }]);

  return Header;
})(_react2['default'].Component);

var Promote = (function (_React$Component2) {
  function Promote(props) {
    _classCallCheck(this, Promote);

    _get(Object.getPrototypeOf(Promote.prototype), 'constructor', this).call(this, props);

    this.state = {
      cursor: 1,
      limit: 5,
      evaluation: null
    };

    this.get();
  }

  _inherits(Promote, _React$Component2);

  _createClass(Promote, [{
    key: 'get',
    value: function get() {
      if (typeof window !== 'undefined') {
        window.socket.emit('get evaluation', this.props.item).on('OK get evaluation', function (evaluation) {});
      }
    }
  }, {
    key: 'render',
    value: function render() {

      var content = _react2['default'].createElement(_utilLoading2['default'], null);

      return _react2['default'].createElement(
        'section',
        { className: 'promote text-center' },
        content
      );
    }
  }]);

  return Promote;
})(_react2['default'].Component);

exports['default'] = Promote;
module.exports = exports['default'];

// console.log({ evaluation })
// if ( evaluation.items)