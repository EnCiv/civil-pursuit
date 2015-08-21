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

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _libAppComponent = require('../lib/app/component');

var _libAppComponent2 = _interopRequireDefault(_libAppComponent);

var _utilModal = require('./util/modal');

var _utilModal2 = _interopRequireDefault(_utilModal);

var _utilForm = require('./util/form');

var _utilForm2 = _interopRequireDefault(_utilForm);

var _utilButton = require('./util/button');

var _utilButton2 = _interopRequireDefault(_utilButton);

var _utilSubmit = require('./util/submit');

var _utilSubmit2 = _interopRequireDefault(_utilSubmit);

var _utilButtonGroup = require('./util/button-group');

var _utilButtonGroup2 = _interopRequireDefault(_utilButtonGroup);

var _utilIcon = require('./util/icon');

var _utilIcon2 = _interopRequireDefault(_utilIcon);

var _utilLink = require('./util/link');

var _utilLink2 = _interopRequireDefault(_utilLink);

var _utilRow = require('./util/row');

var _utilRow2 = _interopRequireDefault(_utilRow);

var _utilColumn = require('./util/column');

var _utilColumn2 = _interopRequireDefault(_utilColumn);

var _utilEmailInput = require('./util/email-input');

var _utilEmailInput2 = _interopRequireDefault(_utilEmailInput);

var _utilPassword = require('./util/password');

var _utilPassword2 = _interopRequireDefault(_utilPassword);

var _utilLoading = require('./util/loading');

var _utilLoading2 = _interopRequireDefault(_utilLoading);

var ForgotPassword = (function (_React$Component) {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function ForgotPassword(props) {
    _classCallCheck(this, ForgotPassword);

    _get(Object.getPrototypeOf(ForgotPassword.prototype), 'constructor', this).call(this, props);

    this.state = { validationError: null, successMessage: null, info: null };
  }

  _inherits(ForgotPassword, _React$Component);

  _createClass(ForgotPassword, [{
    key: 'sendResetPassword',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function sendResetPassword() {

      this.setState({ validationError: null, info: 'One moment...' });

      var email = _react2['default'].findDOMNode(this.refs.email).value;

      window.socket.emit('send password', email);
    }
  }, {
    key: 'signUp',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function signUp(e) {
      e.preventDefault();

      this.props.join();
    }
  }, {
    key: 'signIn',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function signIn(e) {
      e.preventDefault();

      this.props.login();
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render() {
      var classes = ['syn-login'];

      if (this.props.show) {
        classes.push('syn--visible');
      }

      var content = _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          'div',
          { className: 'syn-form-group' },
          _react2['default'].createElement(
            'label',
            null,
            'Email'
          ),
          _react2['default'].createElement(_utilEmailInput2['default'], { block: true, autoFocus: true, required: true, medium: true, placeholder: 'Email', ref: 'email' })
        ),
        _react2['default'].createElement(
          'div',
          { className: 'syn-form-group syn-form-submit' },
          _react2['default'].createElement(
            _utilSubmit2['default'],
            { block: true, large: true, success: true, radius: true },
            'Send me reset password email'
          )
        ),
        _react2['default'].createElement(
          _utilRow2['default'],
          { 'data-stack': 'phone-and-down' },
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '50', gutter: true },
            _react2['default'].createElement(
              'a',
              { href: '', onClick: this.signUp.bind(this) },
              'Sign up'
            )
          ),
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '50', 'text-right': true, gutter: true },
            _react2['default'].createElement(
              'a',
              { href: '', onClick: this.signIn.bind(this) },
              'Sign in'
            )
          )
        )
      );

      if (this.state.info) {
        content = _react2['default'].createElement(_utilLoading2['default'], { message: this.state.info });
      } else if (this.state.successMessage) {
        content = _react2['default'].createElement('div', null);
      }

      return _react2['default'].createElement(
        _utilModal2['default'],
        { className: _libAppComponent2['default'].classList.apply(_libAppComponent2['default'], [this].concat(classes)), title: 'Forgot password?' },
        _react2['default'].createElement(
          _utilForm2['default'],
          { handler: this.sendResetPassword.bind(this), flash: this.state, 'form-center': true },
          content
        )
      );
    }
  }]);

  return ForgotPassword;
})(_react2['default'].Component);

exports['default'] = ForgotPassword;
module.exports = exports['default'];