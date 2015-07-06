'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _synLibAppMilk = require('syn/lib/app/milk');

var _synLibAppMilk2 = _interopRequireDefault(_synLibAppMilk);

var _synModelsUser = require('syn/models/user');

var _synModelsUser2 = _interopRequireDefault(_synModelsUser);

var Login = (function (_Milk) {
  function Login(props) {
    var _this = this;

    _classCallCheck(this, Login);

    props = props || {};

    var options = { viewport: props.viewport };

    _get(Object.getPrototypeOf(Login.prototype), 'constructor', this).call(this, 'Login', options);

    this.props = props || {};

    var get = this.get.bind(this);

    if (this.props.driver !== false) {
      this.go('/');
    }

    if (this.props.toggled === false) {
      this.ok(function () {
        return _this.find('.login-button').click();
      });
      this.wait(1);
    }

    this

    // Create test user from DB

    .set('User', function () {
      return _synModelsUser2['default'].disposable();
    })

    // Set DOM selectors

    .set('Main', function () {
      return _this.find(Login.find('main'));
    }).set('Form', function () {
      return _this.find(Login.find('form'));
    }).set('Email', function () {
      return _this.find(Login.find('email'));
    }).set('Password', function () {
      return _this.find(Login.find('password'));
    }).set('Submit', function () {
      return _this.find(Login.find('submit'));
    }).set('404', function () {
      return _this.find(Login.find('404'));
    }).set('401', function () {
      return _this.find(Login.find('401'));
    })

    // Visibility

    .ok(function () {
      return get('Main').is(':visible');
    }, 'Login is visible').ok(function () {
      return get('Form').is(':visible');
    }, 'Form is visible').ok(function () {
      return get('Email').is(':visible');
    }, 'Email field is visible').ok(function () {
      return get('Password').is(':visible');
    }, 'Password field is visible').ok(function () {
      return get('Submit').is(':visible');
    }, 'Submit button is visible').ok(function () {
      return get('401').not(':visible');
    }, '401 Alert is not visible').ok(function () {
      return get('404').not(':visible');
    }, '404 Alert is not visible')

    // VALIDATIONS

    // Missing email

    .ok(function () {
      return get('Submit').click();
    }, 'Submit Login').ok(function () {
      return get('Email').is('.error');
    }, 'Email is complaining because empty')

    // Missing password

    .ok(function () {
      return get('Email').val('##### fake user #####');
    }, 'Entering fake email').ok(function () {
      return get('Submit').click();
    }, 'Submit Login').ok(function () {
      return get('Email').not('.error');
    }, 'Email is not complaining anymore').ok(function () {
      return get('Password').is('.error');
    }, 'Password is complaining because it is empty')

    // Validations OK

    .ok(function () {
      return get('Password').val('####');
    }, 'Enetring fake password').ok(function () {
      return get('Submit').click();
    }, 'Submit Login').ok(function () {
      return get('Email').not('.error');
    }, 'Email is not complaining').ok(function () {
      return get('Password').not('.error');
    }, 'Password is not complaining')

    // User not found

    .ok(function () {
      return get('Submit').click();
    }, 'Submit form').wait(1).ok(function () {
      return get('404').is(':visible');
    }, '404 alert (email not found) is visible').ok(function () {
      return get('401').not(':visible');
    }, '401 alert (wrong password) is hidden')

    // Wrong password

    .ok(function () {
      return get('Email').val(get('User').email);
    }, 'Entering real email').ok(function () {
      return get('Submit').click();
    }, 'Submit Login').wait(2).ok(function () {
      return get('401').is(':visible');
    }, '401 alert (wrong password) is visible').ok(function () {
      return get('404').not(':visible');
    }, '404 alert (email not found) is hidden')

    // OK
    .ok(function () {
      return get('Password').val('1234');
    }, 'Setting real password').ok(function () {
      return get('Submit').click();
    }, 'Submit loging').wait(2).ok(function () {
      return get('401').is(false);
    }, '401 alert (wrong password) is hidden').ok(function () {
      return get('404').is(false);
    }, '404 alert (email not found) is hidden').ok(function () {
      return get('Main').is(false);
    }, 'Login is visible')

    // UI is now for signed-in users

    .wait(1).ok(function () {
      return get('Main').is(false);
    });
  }

  _inherits(Login, _Milk);

  _createClass(Login, [{
    key: 'clean',
    value: function clean() {
      var User = this.get('User');

      if (User) {}
    }
  }], [{
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'main':
          return '.login-modal';

        case 'form':
          return Login.find('main') + ' form[name="login"]';

        case 'email':
          return Login.find('form') + ' input[type="email"][name="email"]';

        case 'password':
          return Login.find('form') + ' input[type="password"][name="password"]';

        case 'submit':
          return Login.find('form') + ' button.login-submit';

        case '404':
          return Login.find('form') + ' .login-error-404';

        case '401':
          return Login.find('form') + ' .login-error-401';
      }
    }
  }]);

  return Login;
})(_synLibAppMilk2['default']);

exports['default'] = Login;
module.exports = exports['default'];

// User.remove();