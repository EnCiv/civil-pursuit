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

var _libAppComponent = require('../lib/app/component');

var _libAppComponent2 = _interopRequireDefault(_libAppComponent);

var _utilCloudinaryImage = require('./util/cloudinary-image');

var _utilCloudinaryImage2 = _interopRequireDefault(_utilCloudinaryImage);

var _utilButton = require('./util/button');

var _utilButton2 = _interopRequireDefault(_utilButton);

var _utilIcon = require('./util/icon');

var _utilIcon2 = _interopRequireDefault(_utilIcon);

var _utilLink = require('./util/link');

var _utilLink2 = _interopRequireDefault(_utilLink);

var _login = require('./login');

var _login2 = _interopRequireDefault(_login);

var _join = require('./join');

var _join2 = _interopRequireDefault(_join);

var TopBar = (function (_React$Component) {
  function TopBar(props) {
    _classCallCheck(this, TopBar);

    _get(Object.getPrototypeOf(TopBar.prototype), 'constructor', this).call(this, props);

    this.state = {
      showLogin: false,
      showJoin: false
    };
  }

  _inherits(TopBar, _React$Component);

  _createClass(TopBar, [{
    key: 'toggleLogin',
    value: function toggleLogin(e) {
      if (e) {
        e.preventDefault();
      }

      this.setState({ showLogin: !this.state.showLogin });

      if (this.state.showJoin) {
        this.setState({ showJoin: false });
      }
    }
  }, {
    key: 'toggleJoin',
    value: function toggleJoin(e) {
      if (e) {
        e.preventDefault();
      }

      this.setState({ showJoin: !this.state.showJoin });

      if (this.state.showLogin) {
        this.setState({ showLogin: false });
      }
    }
  }, {
    key: 'signOut',
    value: function signOut() {
      location.href = '/sign/out';
    }
  }, {
    key: 'goToProfile',
    value: function goToProfile() {
      location.href = '/page/profile';
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var user = _props.user;
      var ready = _props.ready;

      var comp = 'syn-top_bar';

      var onlineNow = this.props.online || 0;

      var right1 = undefined,
          right2 = undefined;

      if (ready) {
        if (user) {
          right1 = _react2['default'].createElement(
            'section',
            { className: '' + comp + '-profile-button' },
            _react2['default'].createElement(
              _utilButton2['default'],
              { onClick: this.goToProfile.bind(this) },
              _react2['default'].createElement(_utilIcon2['default'], { icon: 'user' })
            )
          );

          right2 = _react2['default'].createElement(
            'section',
            { className: '' + comp + '-join_button' },
            _react2['default'].createElement(
              _utilButton2['default'],
              { onClick: this.signOut.bind(this) },
              _react2['default'].createElement(_utilIcon2['default'], { icon: 'sign-out' })
            )
          );
        } else {
          right1 = _react2['default'].createElement(
            'section',
            { className: '' + comp + '-login_button' },
            _react2['default'].createElement(
              _utilButton2['default'],
              { onClick: this.toggleLogin.bind(this) },
              'Login'
            )
          );

          right2 = _react2['default'].createElement(
            'section',
            { className: '' + comp + '-join_button' },
            _react2['default'].createElement(
              _utilButton2['default'],
              { onClick: this.toggleJoin.bind(this) },
              'Join'
            )
          );
        }
      }

      return _react2['default'].createElement(
        'section',
        null,
        _react2['default'].createElement(
          'header',
          { role: 'banner', className: 'syn-top_bar' },
          _react2['default'].createElement(
            'section',
            { className: '' + comp + '-left' },
            _react2['default'].createElement(
              'section',
              { className: '' + comp + '-image' },
              _react2['default'].createElement(
                _utilLink2['default'],
                { href: '/' },
                _react2['default'].createElement(_utilCloudinaryImage2['default'], { id: 'Synaccord_logo_64x61_znpxlc.png', screen: 'phone-and-down', transparent: true }),
                _react2['default'].createElement(_utilCloudinaryImage2['default'], { id: 'Synaccord_logo_name_300x61_xyohja.png', screen: 'tablet-and-up', transparent: true })
              )
            ),
            _react2['default'].createElement(
              'section',
              { className: '' + comp + '-beta' },
              'beta'
            )
          ),
          _react2['default'].createElement(
            'section',
            { className: '' + comp + '-right' },
            _react2['default'].createElement(
              'section',
              { className: _libAppComponent2['default'].classList(this, '' + comp + '-online_now', 'syn-screen-phone_and_up') },
              'Online now: ',
              onlineNow
            ),
            right1,
            right2
          )
        ),
        _react2['default'].createElement(_login2['default'], { show: this.state.showLogin, join: this.toggleJoin.bind(this) }),
        _react2['default'].createElement(_join2['default'], { show: this.state.showJoin, login: this.toggleLogin.bind(this) })
      );
    }
  }]);

  return TopBar;
})(_react2['default'].Component);

exports['default'] = TopBar;
module.exports = exports['default'];