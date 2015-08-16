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

var _utilInputGroup = require('./util/input-group');

var _utilInputGroup2 = _interopRequireDefault(_utilInputGroup);

var _utilLoading = require('./util/loading');

var _utilLoading2 = _interopRequireDefault(_utilLoading);

var Join = (function (_React$Component) {
  function Join(props) {
    _classCallCheck(this, Join);

    _get(Object.getPrototypeOf(Join.prototype), 'constructor', this).call(this, props);

    this.state = { validationError: null, successMessage: null, info: null };
  }

  _inherits(Join, _React$Component);

  _createClass(Join, [{
    key: 'signup',
    value: function signup() {
      var _this = this;

      var email = _react2['default'].findDOMNode(this.refs.email).value,
          password = _react2['default'].findDOMNode(this.refs.password).value,
          confirm = _react2['default'].findDOMNode(this.refs.confirm).value,
          agree = _react2['default'].findDOMNode(this.refs.agree);

      this.setState({ validationError: null, info: 'Logging you in...' });

      if (password !== confirm) {
        this.setState({ validationError: 'Passwords do not match', info: null });

        return;
      }

      if (!agree.classList.contains('fa-check-square-o')) {
        this.setState({ validationError: 'Please agree to our terms of service', info: null });

        return;
      }

      _superagent2['default'].post('/sign/up').send({ email: email, password: password }).end(function (err, res) {
        switch (res.status) {
          case 401:
            _this.setState({ validationError: 'This email address is already taken', info: null });
            break;

          case 200:
            _this.setState({ validationError: null, successMessage: 'Welcome back', info: null });
            location.href = '/page/profile';
            break;

          default:
            _this.setState({ validationError: 'Unknown error', info: null });
            break;
        }

        // location.href = '/';
      });
    }
  }, {
    key: 'signIn',
    value: function signIn(e) {
      e.preventDefault();

      this.props.login();
    }
  }, {
    key: 'loginWithFacebook',
    value: function loginWithFacebook() {
      location.href = '/sign/facebook';
    }
  }, {
    key: 'loginWithTwitter',
    value: function loginWithTwitter() {
      location.href = '/sign/twitter';
    }
  }, {
    key: 'agree',
    value: function agree() {
      var box = _react2['default'].findDOMNode(this.refs.agree);

      if (box.classList.contains('fa-square-o')) {
        box.classList.remove('fa-square-o');
        box.classList.add('fa-check-square-o');
      } else {
        box.classList.add('fa-square-o');
        box.classList.remove('fa-check-square-o');
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var classes = ['syn-join'];

      if (this.props.show) {
        classes.push('syn--visible');
      }

      var content = _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          _utilButtonGroup2['default'],
          { block: true },
          _react2['default'].createElement(
            _utilButton2['default'],
            { primary: true, onClick: this.loginWithFacebook, medium: true },
            _react2['default'].createElement(_utilIcon2['default'], { icon: 'facebook' }),
            _react2['default'].createElement(
              'span',
              { className: _libAppComponent2['default'].classList(this), inline: true },
              ' Facebook'
            )
          ),
          _react2['default'].createElement(
            _utilButton2['default'],
            { info: true, onClick: this.loginWithTwitter, medium: true },
            _react2['default'].createElement(_utilIcon2['default'], { icon: 'twitter' }),
            _react2['default'].createElement(
              'span',
              null,
              ' Twitter'
            )
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'syn-form-group' },
          _react2['default'].createElement(
            'label',
            null,
            'Email'
          ),
          _react2['default'].createElement(_utilEmailInput2['default'], { block: true, autoFocus: true, medium: true, required: true, placeholder: 'Email', ref: 'email' })
        ),
        _react2['default'].createElement(
          _utilRow2['default'],
          null,
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '50' },
            _react2['default'].createElement(
              'div',
              { className: 'syn-form-group' },
              _react2['default'].createElement(
                'label',
                null,
                'Password'
              )
            )
          ),
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '50' },
            _react2['default'].createElement(
              'div',
              { className: 'syn-form-group' },
              _react2['default'].createElement(
                'label',
                null,
                'Confirm password'
              )
            )
          )
        ),
        _react2['default'].createElement(
          _utilInputGroup2['default'],
          { block: true },
          _react2['default'].createElement(_utilPassword2['default'], { required: true, placeholder: 'Password', ref: 'password', medium: true }),
          _react2['default'].createElement(_utilPassword2['default'], { required: true, placeholder: 'Confirm password', ref: 'confirm', medium: true })
        ),
        _react2['default'].createElement(
          'div',
          { className: 'syn-form-group syn-form-submit' },
          _react2['default'].createElement(
            _utilSubmit2['default'],
            { block: true, large: true, success: true, radius: true },
            'Join'
          )
        ),
        _react2['default'].createElement(
          _utilRow2['default'],
          { 'data-stack': 'phone-and-down' },
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '50', gutter: true },
            'Already a user? ',
            _react2['default'].createElement(
              'a',
              { href: '', onClick: this.signIn.bind(this) },
              'Sign in'
            )
          ),
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '50', 'text-right': true, gutter: true },
            _react2['default'].createElement(_utilIcon2['default'], { icon: 'square-o', size: '2', onClick: this.agree.bind(this), ref: 'agree' }),
            ' I agree to the ',
            _react2['default'].createElement(
              'a',
              { href: '/page/terms-of-service' },
              'Terms of Service'
            )
          )
        )
      );

      if (this.state.info) {
        content = _react2['default'].createElement(_utilLoading2['default'], { message: 'Signing you in ...' });
      }

      return _react2['default'].createElement(
        _utilModal2['default'],
        { className: _libAppComponent2['default'].classList.apply(_libAppComponent2['default'], [this].concat(classes)), title: 'Join' },
        _react2['default'].createElement(
          _utilForm2['default'],
          { handler: this.signup.bind(this), flash: this.state, 'form-center': true },
          content
        )
      );
    }
  }], [{
    key: 'click',
    value: function click() {
      document.querySelector('.syn-top_bar-join_button button').click();
    }
  }]);

  return Join;
})(_react2['default'].Component);

exports['default'] = Join;
module.exports = exports['default'];