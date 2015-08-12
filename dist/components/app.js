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

var _layout = require('./layout');

var _layout2 = _interopRequireDefault(_layout);

var _stories = require('./stories');

var _stories2 = _interopRequireDefault(_stories);

var _profile = require('./profile');

var _profile2 = _interopRequireDefault(_profile);

var _kitchenSink = require('./kitchen-sink');

var _kitchenSink2 = _interopRequireDefault(_kitchenSink);

var _termsOfService = require('./terms-of-service');

var _termsOfService2 = _interopRequireDefault(_termsOfService);

var _home = require('./home');

var _home2 = _interopRequireDefault(_home);

var App = (function (_React$Component) {
  function App() {
    _classCallCheck(this, App);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(App, _React$Component);

  _createClass(App, [{
    key: 'render',
    value: function render() {

      var page = _react2['default'].createElement('div', null);

      var showIntro = true;

      if (this.props.path === '/') {
        page = _react2['default'].createElement(_home2['default'], this.props);
      }

      var paths = this.props.path.split(/\//);

      paths.shift();

      switch (paths[0]) {
        case 'page':
          switch (paths[1]) {
            case 'test':
              page = _react2['default'].createElement(_stories2['default'], null);
              showIntro = false;
              break;

            case 'profile':
              page = _react2['default'].createElement(_profile2['default'], null);
              showIntro = false;
              break;

            case 'kitchen-sink':
              page = _react2['default'].createElement(_kitchenSink2['default'], null);
              showIntro = false;
              break;

            case 'terms-of-service':
              page = _react2['default'].createElement(_termsOfService2['default'], null);
              showIntro = false;
              break;
          }
          break;
      }

      return _react2['default'].createElement(
        _layout2['default'],
        _extends({}, this.props, { 'show-intro': showIntro }),
        page
      );
    }
  }]);

  return App;
})(_react2['default'].Component);

exports['default'] = App;
module.exports = exports['default'];