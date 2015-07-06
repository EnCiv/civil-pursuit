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

var Join = (function (_Milk) {
  function Join(props) {
    var _this = this;

    _classCallCheck(this, Join);

    props = props || {};

    var options = { viewport: props.viewport };

    _get(Object.getPrototypeOf(Join.prototype), 'constructor', this).call(this, 'Join', options);

    this.props = props || {};

    var get = this.get.bind(this);

    if (this.props.driver !== false) {
      this.go('/');
    }

    if (this.props.toggled === false) {
      this.ok(function () {
        return _this.find('.join-button').click();
      });
      this.wait(1);
    }

    this

    // Create test user from DB

    .set('User', function () {
      return _synModelsUser2['default'].disposable();
    })

    // User to create

    .set('My email', 'test-test@test-' + Date.now() + '.com').set('My password', Date.now())

    // Set DOM selectors

    .set('Main', function () {
      return _this.find(Join.find('main'));
    }).set('Form', function () {
      return _this.find(Join.find('form'));
    }).set('Email', function () {
      return _this.find(Join.find('email'));
    }).set('Password', function () {
      return _this.find(Join.find('password'));
    }).set('Confirm', function () {
      return _this.find(Join.find('confirm'));
    }).set('Submit', function () {
      return _this.find(Join.find('submit'));
    }).set('Agree', function () {
      return _this.find(Join.find('agree'));
    }).set('Agree alert', function () {
      return _this.find(Join.find('agree alert'));
    }).set('Exists', function () {
      return _this.find(Join.find('exists'));
    })

    // Visibility

    .ok(function () {
      return get('Main').is(':visible');
    }).ok(function () {
      return get('Form').is(':visible');
    }).ok(function () {
      return get('Email').is(':visible');
    }).ok(function () {
      return get('Password').is(':visible');
    }).ok(function () {
      return get('Confirm').is(':visible');
    }).ok(function () {
      return get('Submit').is(':visible');
    }).ok(function () {
      return get('Agree alert').not(':visible');
    })

    // VALIDATIONS

    // Missing email

    .ok(function () {
      return get('Submit').click();
    }).ok(function () {
      return get('Email').is('.error');
    })

    // Missing password

    .ok(function () {
      return get('Email').val(get('User').email);
    }).ok(function () {
      return get('Submit').click();
    }).ok(function () {
      return get('Email').not('.error');
    }).ok(function () {
      return get('Password').is('.error');
    })

    // Missing confirm

    .ok(function () {
      return get('Password').val('abc');
    }).ok(function () {
      return get('Submit').click();
    }).ok(function () {
      return get('Email').not('.error');
    }).ok(function () {
      return get('Password').not('.error');
    }).ok(function () {
      return get('Confirm').is('.error');
    })

    // Password and confirm don't match

    .ok(function () {
      return get('Confirm').val('123');
    }).ok(function () {
      return get('Submit').click();
    }).ok(function () {
      return get('Email').not('.error');
    }).ok(function () {
      return get('Password').not('.error');
    }).ok(function () {
      return get('Confirm').is('.error');
    })

    // User did not agree

    .ok(function () {
      return get('Confirm').val('abc');
    }).ok(function () {
      return get('Submit').click();
    }).ok(function () {
      return get('Email').not('.error');
    }).ok(function () {
      return get('Password').not('.error');
    }).ok(function () {
      return get('Confirm').not('.error');
    }).ok(function () {
      return get('Agree alert').is(':visible');
    })

    // Agree

    .ok(function () {
      return get('Agree').click();
    }).ok(function () {
      return get('Agree').is('.fa-check-square-o');
    })

    // User already taken

    .ok(function () {
      return get('Submit').click();
    }).wait(1).ok(function () {
      return get('Exists').is(':visible');
    })

    // Create user

    .ok(function () {
      return get('Email').val(get('My email'));
    }).ok(function () {
      return get('Password').val(get('My password'));
    }).ok(function () {
      return get('Confirm').val(get('My password'));
    }).ok(function () {
      return get('Submit').click();
    })

    // UI is now for signed-in users

    .wait(1).ok(function () {
      return get('Main').is(false);
    });
  }

  _inherits(Join, _Milk);

  _createClass(Join, [{
    key: 'clean',
    value: function clean() {
      var User = this.get('User');

      if (User) {
        User.remove();
      }
    }
  }], [{
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'main':
          return '.join-modal';

        case 'form':
          return Join.find('main') + ' form[name="join"]';

        case 'email':
          return Join.find('form') + ' input[type="email"][name="email"]';

        case 'password':
          return Join.find('form') + ' input[type="password"][name="password"]';

        case 'confirm':
          return Join.find('form') + ' input[type="password"][name="confirm"]';

        case 'submit':
          return Join.find('form') + ' button.join-submit';

        case 'agree':
          return Join.find('form') + ' .i-agree .agreed';

        case 'agree alert':
          return Join.find('form') + ' .please-agree.warning';

        case 'exists':
          return Join.find('form') + ' .already-taken.warning';
      }
    }
  }]);

  return Join;
})(_synLibAppMilk2['default']);

exports['default'] = Join;
module.exports = exports['default'];