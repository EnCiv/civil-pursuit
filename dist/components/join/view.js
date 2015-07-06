'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoDist = require('cinco/dist');

var _synLibAppPage = require('syn/lib/app/page');

var _synLibAppPage2 = _interopRequireDefault(_synLibAppPage);

var Join = (function (_Element) {
  function Join(props) {
    _classCallCheck(this, Join);

    _get(Object.getPrototypeOf(Join.prototype), 'constructor', this).call(this, '.join-modal');

    this.add(new _cincoDist.Element('h4').text('Join with'), new _cincoDist.Element('.button-group').add(this.signWithFacebook(), this.signWithTwitter()), new _cincoDist.Element('h4').text('Join with email'), this.form());
  }

  _inherits(Join, _Element);

  _createClass(Join, [{
    key: 'signWithFacebook',
    value: function signWithFacebook() {
      return new _cincoDist.Element('a.button', { href: (0, _synLibAppPage2['default'])('Sign With Facebook') }).add(new _cincoDist.Element('i.fa.fa-facebook'), new _cincoDist.Element('span').text(' Facebook'));
    }
  }, {
    key: 'signWithTwitter',
    value: function signWithTwitter() {
      return new _cincoDist.Element('a.button', { href: (0, _synLibAppPage2['default'])('Sign With Twitter') }).add(new _cincoDist.Element('i.fa.fa-twitter'), new _cincoDist.Element('span').text(' Twitter'));
    }
  }, {
    key: 'email',
    value: function email() {
      return new _cincoDist.Element('.form-group.tablet-50.middle').add(new _cincoDist.Element('label').text('Email'), new _cincoDist.Element('input.block', {
        type: 'email',
        name: 'email',
        required: true,
        placeholder: 'Email'
      }));
    }
  }, {
    key: 'password',
    value: function password() {
      return new _cincoDist.Element('.form-group.tablet-50.middle').add(new _cincoDist.Element('label').text('Password'), new _cincoDist.Element('input.block', {
        type: 'password',
        name: 'password',
        required: true,
        placeholder: 'Password'
      }));
    }
  }, {
    key: 'confirm',
    value: function confirm() {
      return new _cincoDist.Element('.form-group.tablet-50.middle').add(new _cincoDist.Element('label').text('Confirm password'), new _cincoDist.Element('input.block', {
        type: 'password',
        name: 'confirm',
        required: true,
        placeholder: 'Confirm password'
      }));
    }
  }, {
    key: 'submit',
    value: function submit() {
      return new _cincoDist.Element('.form-group.tablet-50.middle').add(new _cincoDist.Element('label').text('Join'), new _cincoDist.Element('button.primary.join-submit.block.small').text('Join'));
    }
  }, {
    key: 'iAgree',
    value: function iAgree() {
      return new _cincoDist.Element('.i-agree').add(new _cincoDist.Element('button.shy', { type: 'button' }).add(new _cincoDist.Element('i.fa.fa-2x.fa-square-o.agreed')), new _cincoDist.Element('span').add(new _cincoDist.Element('span').text(' I agree to'), new _cincoDist.Element('a', {
        href: (0, _synLibAppPage2['default'])('Terms Of Service')
      }).text('the terms of service'), new _cincoDist.Element('span').text('.')));
    }
  }, {
    key: 'form',
    value: function form() {
      return new _cincoDist.Element('form', {
        novalidate: 'novalidate',
        role: 'form',
        method: 'POST',
        name: 'join'
      }).add(new _cincoDist.Element('.block.warning.hide.please-agree').text('Please agree to our Terms of service'), new _cincoDist.Element('.block.warning.hide.already-taken').text('Email already taken'), new _cincoDist.Element('.row').add(this.email(), this.password(), this.confirm(), this.submit()), this.iAgree());
    }
  }]);

  return Join;
})(_cincoDist.Element);

exports['default'] = Join;
module.exports = exports['default'];