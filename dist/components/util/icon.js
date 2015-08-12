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

var Icon = (function (_React$Component) {
  function Icon() {
    _classCallCheck(this, Icon);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Icon, _React$Component);

  _createClass(Icon, [{
    key: 'render',
    value: function render() {
      var classes = ['fa'];

      if (this.props.icon) {
        classes.push('fa-' + this.props.icon);
      }

      if (this.props.size) {
        classes.push('fa-' + this.props.size + 'x');
      }

      if (this.props.list) {
        classes.push('fa-li');
      }

      if (this.props.spin) {
        classes.push('fa-spin');
      }

      if (this.props.className) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.props.className.split(/\s+/)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var cls = _step.value;

            classes.push(cls);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      if (this.props.circle) {
        classes.push('fa-stack-1x');
        return _react2['default'].createElement(
          'span',
          { className: 'fa-stack fa-lg' },
          _react2['default'].createElement('i', { className: 'fa fa-circle-o fa-stack-2x' }),
          _react2['default'].createElement('i', _extends({}, this.props, { className: classes.join(' ') }))
        );
      } else {
        return _react2['default'].createElement('i', _extends({}, this.props, { className: classes.join(' ') }));
      }
    }
  }]);

  return Icon;
})(_react2['default'].Component);

exports['default'] = Icon;
module.exports = exports['default'];