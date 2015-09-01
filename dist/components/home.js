'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _libAppComponent = require('../lib/app/component');

var _libAppComponent2 = _interopRequireDefault(_libAppComponent);

var _utilIcon = require('./util/icon');

var _utilIcon2 = _interopRequireDefault(_utilIcon);

var _countdown = require('./countdown');

var _countdown2 = _interopRequireDefault(_countdown);

var _panelItems = require('./panel-items');

var _panelItems2 = _interopRequireDefault(_panelItems);

var _training = require('./training');

var _training2 = _interopRequireDefault(_training);

var Home = (function (_React$Component) {
  function Home(props) {
    _classCallCheck(this, Home);

    _get(Object.getPrototypeOf(Home.prototype), 'constructor', this).call(this, props);

    this.state = { discussion: null };

    this.get();
  }

  _inherits(Home, _React$Component);

  _createClass(Home, [{
    key: 'get',
    value: function get() {
      var _this = this;

      if (typeof window !== 'undefined') {
        window.socket.emit('get discussion').on('OK get discussion', function (discussion) {
          return _this.setState({ discussion: discussion });
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {

      var content = _react2['default'].createElement(
        'div',
        { className: _libAppComponent2['default'].classList(this, 'text-center', 'gutter', 'muted') },
        _react2['default'].createElement(_utilIcon2['default'], { icon: 'circle-o-notch', spin: true, size: 4 })
      );

      if (this.state.discussion) {
        var _ref = new Date(this.state.discussion);

        var deadline = _ref.deadline;

        var now = Date.now();

        if (now < deadline) {
          content = _react2['default'].createElement(_countdown2['default'], _extends({ discussion: this.state.discussion }, this.props));
        } else if (this.props.topLevelType) {
          var panel = this.props.panels[this.props.topLevelType];

          content = _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(_panelItems2['default'], _extends({ panel: panel }, this.props)),
            _react2['default'].createElement(_training2['default'], this.props)
          );
        }
      }

      return content;
    }
  }]);

  return Home;
})(_react2['default'].Component);

exports['default'] = Home;
module.exports = exports['default'];