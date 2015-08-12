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

var _libAppComponent = require('../../lib/app/component');

var _libAppComponent2 = _interopRequireDefault(_libAppComponent);

var Image = (function (_React$Component) {
  function Image() {
    _classCallCheck(this, Image);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Image, _React$Component);

  _createClass(Image, [{
    key: 'render',
    value: function render() {

      var classes = [];

      if (this.props.responsive) {
        classes.push('syn-img-responsive');
      }

      return _react2['default'].createElement('img', { alt: 'Synappp', src: this.props.src, className: _libAppComponent2['default'].classList.apply(_libAppComponent2['default'], [this].concat(classes)) });
    }
  }]);

  return Image;
})(_react2['default'].Component);

exports['default'] = Image;
module.exports = exports['default'];