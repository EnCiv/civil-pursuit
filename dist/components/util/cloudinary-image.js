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

var _image = require('./image');

var _image2 = _interopRequireDefault(_image);

var CloudinaryImage = (function (_React$Component) {
  function CloudinaryImage() {
    _classCallCheck(this, CloudinaryImage);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(CloudinaryImage, _React$Component);

  _createClass(CloudinaryImage, [{
    key: 'render',
    value: function render() {
      var url = ['http:/', 'res.cloudinary.com', 'hscbexf6a', 'image', 'upload'];

      var filters = [];

      if (this.props.transparent) {
        filters.push('e_make_transparent');
      }

      if (filters.length) {
        url.push(filters.join('&'));
      }

      if (this.props.version) {
        url.push(this.props.version);
      }

      url.push(this.props.id);

      return _react2['default'].createElement(_image2['default'], _extends({ alt: 'Synappp', src: url.join('/') }, this.props));
    }
  }]);

  return CloudinaryImage;
})(_react2['default'].Component);

exports['default'] = CloudinaryImage;
module.exports = exports['default'];