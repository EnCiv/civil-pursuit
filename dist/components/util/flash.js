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

var Flash = (function (_React$Component) {
  function Flash() {
    _classCallCheck(this, Flash);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Flash, _React$Component);

  _createClass(Flash, [{
    key: 'render',
    value: function render() {
      var classes = ['syn-flash'];

      if (this.props.error) {
        classes.push('syn-flash--error');
      }

      if (this.props.success) {
        classes.push('syn-flash--success');
      }

      if (this.props.info) {
        classes.push('syn-flash--info');
      }

      return _react2['default'].createElement(
        'div',
        { className: classes.join(' ') },
        this.props.message
      );
    }
  }]);

  return Flash;
})(_react2['default'].Component);

exports['default'] = Flash;
module.exports = exports['default'];