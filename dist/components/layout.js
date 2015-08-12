'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _topBar = require('./top-bar');

var _topBar2 = _interopRequireDefault(_topBar);

var _footer = require('./footer');

var _footer2 = _interopRequireDefault(_footer);

var _panel = require('./panel');

var _panel2 = _interopRequireDefault(_panel);

var _intro = require('./intro');

var _intro2 = _interopRequireDefault(_intro);

var Layout = (function (_React$Component) {
  function Layout() {
    _classCallCheck(this, Layout);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Layout, _React$Component);

  _createClass(Layout, [{
    key: 'render',
    value: function render() {
      var intro = undefined;

      if (this.props['show-intro']) {
        intro = _react2['default'].createElement(_intro2['default'], this.props);
      }

      return _react2['default'].createElement(
        'section',
        null,
        _react2['default'].createElement(_topBar2['default'], this.props),
        intro,
        this.props.children,
        _react2['default'].createElement(_footer2['default'], null)
      );
    }
  }]);

  return Layout;
})(_react2['default'].Component);

exports['default'] = Layout;
module.exports = exports['default'];