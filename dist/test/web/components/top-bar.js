'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _libAppMilk = require('../../../lib/app/milk');

var _libAppMilk2 = _interopRequireDefault(_libAppMilk);

var _configJson = require('../../../../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _componentsJoin = require('../components/join');

var _componentsJoin2 = _interopRequireDefault(_componentsJoin);

var _componentsLogin = require('../components/login');

var _componentsLogin2 = _interopRequireDefault(_componentsLogin);

var _componentsVex = require('../components/vex');

var _componentsVex2 = _interopRequireDefault(_componentsVex);

var TopBar = (function (_Milk) {
  function TopBar(props) {
    var _this = this;

    _classCallCheck(this, TopBar);

    props = props || {};

    var options = { viewport: props.viewport };

    _get(Object.getPrototypeOf(TopBar.prototype), 'constructor', this).call(this, 'Top Bar', options);

    this.props = props;

    if (this.props.driver !== false) {
      this.go('/');
    }

    var get = this.get.bind(this);

    // Get cookie

    this.set('Cookie', function () {
      return _this.getCookie('synuser');
    });

    // Set Selectors

    this.set('Topbar', function () {
      return _this.find('.topbar');
    });
    this.set('Right', function () {
      return _this.find('.topbar-right');
    });
    this.set('Login button', function () {
      return _this.find('button.login-button');
    });
    this.set('Join button', function () {
      return _this.find('button.join-button');
    });
    this.set('Online now', function () {
      return _this.find('button.online-now');
    });
    this.set('Users online', function () {
      return _this.find('span.online-users');
    });
    this.set('Link to Profile', function () {
      return _this.find('a[title="Profile"]');
    });
    this.set('Link to Sign Out', function () {
      return _this.find('a[title="Sign out"]');
    });
    this.set('Join', function () {
      return _this.find(_componentsJoin2['default'].find('main'));
    });
    this.set('Login', function () {
      return _this.find(_componentsLogin2['default'].find('main'));
    });

    // Main

    this.ok(function () {
      return get('Topbar').is(':visible');
    });

    // Right

    this.ok(function () {
      return get('Right').is(':visible');
    });

    // Online users

    if (this.options.viewport === 'tablet') {
      this.ok(function () {
        return get('Online now').is(':visible');
      }).ok(function () {
        return get('Users online').text().then(function (text) {
          return (+text).should.be.a.Number.and.is.above(-1);
        });
      });
    }

    // Links

    this.ok(function () {
      return get('Link to Profile').is(get('Cookie') ? ':visible' : ':hidden');
    }).ok(function () {
      return get('Link to Sign Out').is(get('Cookie') ? ':visible' : ':hidden');
    });

    // Login Button

    this.ok(function () {
      return get('Login button').is(!get('Cookie'));
    });

    // Login Button - Vex

    this['import'](_componentsVex2['default'], { trigger: 'button.login-button' }, null, function (when) {
      return !get('Cookie');
    });

    // Login Button - Toggle Login

    this.ok(function () {
      return get('Login button').click();
    }, null, function (when) {
      return !get('Cookie');
    }).wait(1, null, function (when) {
      return !get('Cookie');
    }).ok(function () {
      return get('Login').is(true);
    }, null, function (when) {
      return !get('Cookie');
    }).ok(function () {
      return get('Login button').click();
    }, null, function (when) {
      return !get('Cookie');
    }).wait(1, null, function (when) {
      return !get('Cookie');
    }).ok(function () {
      return get('Login').is(false);
    }, null, function (when) {
      return !get('Cookie');
    });

    // Join Button

    this.ok(function () {
      return get('Join button').is(!get('Cookie'));
    });

    // Join Button - Vex

    this['import'](_componentsVex2['default'], { trigger: 'button.join-button' }, null, function (when) {
      return !get('Cookie');
    });

    // Join Button - Toggle Join

    this.ok(function () {
      return get('Join button').click();
    }, null, function (when) {
      return !get('Cookie');
    }).wait(1, null, function (when) {
      return !get('Cookie');
    }).ok(function () {
      return get('Join').is(true);
    }, null, function (when) {
      return !get('Cookie');
    }).ok(function () {
      return get('Join button').click();
    }, null, function (when) {
      return !get('Cookie');
    }).wait(1, null, function (when) {
      return !get('Cookie');
    }).ok(function () {
      return get('Join').is(false);
    }, null, function (when) {
      return !get('Cookie');
    });
  }

  _inherits(TopBar, _Milk);

  return TopBar;
})(_libAppMilk2['default']);

exports['default'] = TopBar;
module.exports = exports['default'];