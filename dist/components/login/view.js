'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoDist = require('cinco/dist');

var Login = (function (_Element) {
  function Login(props) {
    _classCallCheck(this, Login);

    _get(Object.getPrototypeOf(Login.prototype), 'constructor', this).call(this, '.login-modal');

    this.add(new _cincoDist.Element('h4').text('Login with email'), new _cincoDist.Element('form', {
      role: 'form',
      method: 'POST',
      novalidate: 'novalidate',
      name: 'login'
    }).add(new _cincoDist.Element('.login-error-404.is-container').add(new _cincoDist.Element('.is-section').add(new _cincoDist.Element('.danger').add(new _cincoDist.Element('p').add(new _cincoDist.Element('strong').text('Wrong email'))))), new _cincoDist.Element('.login-error-401.is-container').add(new _cincoDist.Element('.is-section').add(new _cincoDist.Element('.danger').add(new _cincoDist.Element('p').add(new _cincoDist.Element('strong').text('Wrong password'))))), new _cincoDist.Element('.sign-success.success'), new _cincoDist.Element('.form-group').add(new _cincoDist.Element('label').text('Email'), new _cincoDist.Element('input', {
      type: 'email',
      placeholder: 'Email',
      name: 'email',
      required: 'required'
    })), new _cincoDist.Element('.form-group').add(new _cincoDist.Element('label').text('Password'), new _cincoDist.Element('input', {
      type: 'password',
      placeholder: 'Password',
      name: 'password',
      required: 'required'
    })), new _cincoDist.Element('p').add(new _cincoDist.Element('button.primary.login-submit.block').add(new _cincoDist.Element('i.fa.fa-sign-in'), new _cincoDist.Element('span').text('Login')))), new _cincoDist.Element('h5').add(new _cincoDist.Element('a.forgot-password-link', {
      href: '#'
    }).text('Forgot password?')));
  }

  _inherits(Login, _Element);

  return Login;
})(_cincoDist.Element);

exports['default'] = Login;
module.exports = exports['default'];