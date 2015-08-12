'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _libAppComponent = require('../../lib/app/component');

var _libAppComponent2 = _interopRequireDefault(_libAppComponent);

var Row = (function (_React$Component) {
  function Row() {
    _classCallCheck(this, Row);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Row, _React$Component);

  _createClass(Row, [{
    key: 'render',
    value: function render() {

      var classes = ['syn-row'];

      if (this.props.baseline) {
        classes.push('syn-row-baseline-items');
      }

      if (this.props.end) {
        classes.push('syn-row-end');
      }

      if (this.props['space-around']) {
        classes.push('syn-row-space-around');
      }

      return _react2['default'].createElement(
        'section',
        _extends({}, this.props, { className: _libAppComponent2['default'].classList.apply(_libAppComponent2['default'], [this].concat(classes)) }),
        this.props.children
      );
    }
  }]);

  return Row;
})(_react2['default'].Component);

exports['default'] = Row;
module.exports = exports['default'];