'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _libAppMilk = require('../../../lib/app/milk');

var _libAppMilk2 = _interopRequireDefault(_libAppMilk);

var _join = require('./join');

var _join2 = _interopRequireDefault(_join);

var _creator = require('./creator');

var _creator2 = _interopRequireDefault(_creator);

var Panel = (function (_Milk) {
  function Panel(props) {
    var _this = this;

    _classCallCheck(this, Panel);

    props = props || {};

    var options = { viewport: props.viewport, session: props.session };

    _get(Object.getPrototypeOf(Panel.prototype), 'constructor', this).call(this, 'Panel', options);

    this.props = props || {};

    var userIsSignedIn = this.props['in'];

    var panelSelector = this.props.panel || '.panel';

    console.log('panel', panelSelector);

    var get = this.get.bind(this);

    if (this.props.driver !== false) {
      this.go('/');
    }

    // Get cookie

    this.set('Cookie', function () {
      return _this.getCookie('synuser');
    });

    this.set('Panel', function () {
      return _this.find(panelSelector);
    }).set('Heading', function () {
      return _this.find(panelSelector + ' .panel-heading');
    }).set('Body', function () {
      return _this.find(panelSelector + ' .panel-body');
    }).set('Join', function () {
      return _this.find(_join2['default'].find('main'));
    }).ok(function () {
      return get('Panel').is(':visible');
    }).ok(function () {
      return get('Panel').is('.panel');
    }).ok(function () {
      return get('Heading').is(':visible');
    }).ok(function () {
      return get('Body').is(':visible');
    });

    if (this.props.creator !== false) {

      this.set('Toggle', function () {
        return _this.find(_this.get('Heading').selector + ' .toggle-creator');
      }).set('Creator', function () {
        return _this.find(_this.get('Body').selector + ' .creator');
      }).ok(function () {
        return get('Toggle').is(':visible');
      }).ok(function () {
        return get('Creator').not(':visible');
      }).ok(function () {
        return get('Toggle').click();
      });

      // User is signed in

      this.wait(1, null, function (when) {
        return get('Cookie');
      });

      this['import'](_creator2['default'], function () {
        return { panel: _this.get('Panel'), viewport: options.viewport };
      }, null, function (when) {
        return get('Cookie');
      });

      this.ok(function () {
        return get('Toggle').click();
      }, null, function (when) {
        return get('Cookie');
      }).wait(2, null, function (when) {
        return get('Cookie');
      });

      this['import'](_creator2['default'], function () {
        return { panel: _this.get('Panel'), upload: true, viewport: options.viewport };
      }, null, function (when) {
        return get('Cookie');
      });

      // User is not signed in

      this.ok(function () {
        return get('Join').is(true);
      }, null, function (when) {
        return !get('Cookie');
      }).ok(function () {
        return get('Toggle').click();
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
  }

  _inherits(Panel, _Milk);

  return Panel;
})(_libAppMilk2['default']);

exports['default'] = Panel;
module.exports = exports['default'];