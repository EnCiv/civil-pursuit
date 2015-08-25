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

var _utilForm = require('./util/form');

var _utilForm2 = _interopRequireDefault(_utilForm);

var _utilEmailInput = require('./util/email-input');

var _utilEmailInput2 = _interopRequireDefault(_utilEmailInput);

var _utilTextInput = require('./util/text-input');

var _utilTextInput2 = _interopRequireDefault(_utilTextInput);

var _utilPassword = require('./util/password');

var _utilPassword2 = _interopRequireDefault(_utilPassword);

var _panel = require('./panel');

var _panel2 = _interopRequireDefault(_panel);

var _utilLoading = require('./util/loading');

var _utilLoading2 = _interopRequireDefault(_utilLoading);

var _utilButton = require('./util/button');

var _utilButton2 = _interopRequireDefault(_utilButton);

var _utilInputGroup = require('./util/input-group');

var _utilInputGroup2 = _interopRequireDefault(_utilInputGroup);

var _login = require('./login');

var _login2 = _interopRequireDefault(_login);

var ResetPassword = (function (_React$Component) {
  function ResetPassword(props) {
    _classCallCheck(this, ResetPassword);

    _get(Object.getPrototypeOf(ResetPassword.prototype), 'constructor', this).call(this, props);

    this.state = {
      user: null,
      validationError: null,
      successMessage: null,
      info: null
    };

    this.get();
  }

  _inherits(ResetPassword, _React$Component);

  _createClass(ResetPassword, [{
    key: 'get',
    value: function get() {
      if (typeof window !== 'undefined' && !this.props.userToReset) {
        window.Dispatcher.emit('get user', { activation_token: this.props.urlParams.token });
      }
    }
  }, {
    key: 'save',
    value: function save() {
      var _this = this;

      var password = _react2['default'].findDOMNode(this.refs.password);
      var confirmPassword = _react2['default'].findDOMNode(this.refs.confirmPassword);
      var resetKey = _react2['default'].findDOMNode(this.refs.reset);

      this.setState({ validationError: null });

      if (password.value !== confirmPassword.value) {
        this.setState({ validationError: 'Passwords don\'t match' });
        return;
      }

      if (resetKey.value !== this.props.userToReset.activation_key) {
        this.setState({ validationError: 'Wrong reset key' });
        return;
      }

      window.Dispatcher.emit('reset password', this.props.userToReset, password.value);

      this.setState({ info: 'Resetting your password' });

      window.Dispatcher.on('password reset', function () {
        _login2['default'].signIn(_this.props.userToReset.email, password.value).then(function () {
          _this.setState({ validationError: null, info: null, successMessage: 'Welcome back' });
          setTimeout(function () {
            return location.href = '/page/profile';
          }, 800);
        }, function (ko) {
          return _this.setState({ validationError: 'Wrong email', info: null });
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var content = _react2['default'].createElement(_utilLoading2['default'], { message: 'Getting user info' });

      if (this.props.userToReset) {

        var user = this.props.userToReset;

        var formContents = undefined;

        if (!this.state.info && !this.state.successMessage) {
          formContents = _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              'h3',
              { className: 'text-center' },
              'Your email'
            ),
            _react2['default'].createElement(_utilEmailInput2['default'], { block: true, autoFocus: true, required: true, medium: true, placeholder: 'Email', ref: 'email', disabled: true, value: user.email }),
            _react2['default'].createElement(
              'h3',
              { className: 'text-center' },
              'Your reset key'
            ),
            _react2['default'].createElement(
              'h5',
              { className: 'text-center' },
              'Enter here the reset key that was sent to you by email'
            ),
            _react2['default'].createElement(_utilTextInput2['default'], { block: true, medium: true, ref: 'reset', required: true, placeholder: 'Your reset key' }),
            _react2['default'].createElement(
              'h3',
              { className: 'text-center' },
              'Enter a new password'
            ),
            _react2['default'].createElement(
              _utilInputGroup2['default'],
              { block: true },
              _react2['default'].createElement(_utilPassword2['default'], { required: true, placeholder: 'Password', ref: 'password', medium: true }),
              _react2['default'].createElement(_utilPassword2['default'], { required: true, placeholder: 'Confirm password', ref: 'confirmPassword', medium: true })
            ),
            _react2['default'].createElement(
              _utilButton2['default'],
              { radius: true, block: true, medium: true, primary: true, style: { marginTop: '10px' }, type: 'submit' },
              'Save new password'
            )
          );
        }

        content = _react2['default'].createElement(
          _utilForm2['default'],
          { 'form-center': true, style: { margin: '10px' }, flash: this.state, handler: this.save.bind(this) },
          formContents
        );
      }

      return _react2['default'].createElement(
        _panel2['default'],
        { title: 'Reset password' },
        content
      );
    }
  }]);

  return ResetPassword;
})(_react2['default'].Component);

exports['default'] = ResetPassword;
module.exports = exports['default'];