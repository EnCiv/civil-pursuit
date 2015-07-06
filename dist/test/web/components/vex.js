'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _libAppMilk = require('../../../lib/app/milk');

var _libAppMilk2 = _interopRequireDefault(_libAppMilk);

var Vex = (function (_Milk) {
  function Vex(props) {
    var _this = this;

    _classCallCheck(this, Vex);

    props = props || {};

    var options = { viewport: props.viewport };

    _get(Object.getPrototypeOf(Vex.prototype), 'constructor', this).call(this, 'Vex Dialog', options);

    this.props = props || {};

    if (this.props.driver !== false) {
      this.go('/');
    }

    this.set('Close', function () {
      return _this.find('.vex-content .vex-dialog-buttons .vex-dialog-button[value="x Close"]');
    });

    this.set('Vex', function () {
      return _this.find('.vex');
    });
    this.set('Overlay', function () {
      return _this.find('.vex-overlay');
    });
    this.set('Content', function () {
      return _this.find('.vex-content');
    });

    this.routine();

    this.routine(true);

    this.routine();
  }

  _inherits(Vex, _Milk);

  _createClass(Vex, [{
    key: 'routine',
    value: function routine(clickOnClose) {
      var trigger = this.props.trigger;

      if (!trigger) {
        trigger = 'button.join-button';
      }

      var find = this.find.bind(this);
      var get = this.get.bind(this);

      this.ok(function () {
        return find(trigger).click();
      }).wait(1).ok(function () {
        return get('Vex').is(':visible');
      }).ok(function () {
        return get('Overlay').is(':visible');
      }).ok(function () {
        return get('Content').is(':visible');
      }).ok(function () {
        return get('Close').is(':visible');
      });

      if (clickOnClose) {
        this.ok(function () {
          return get('Close').click();
        });
      } else {
        this.ok(function () {
          return get('Overlay').click();
        });
      }

      this.wait(1).ok(function () {
        return get('Vex').is(false);
      });
    }
  }]);

  return Vex;
})(_libAppMilk2['default']);

exports['default'] = Vex;
module.exports = exports['default'];