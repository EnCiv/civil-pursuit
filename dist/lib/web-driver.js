'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _events = require('events');

var _webdriverio = require('webdriverio');

var _webdriverio2 = _interopRequireDefault(_webdriverio);

var Driver = (function (_EventEmitter) {
  function Driver() {
    var _this = this;

    var vendor = arguments[0] === undefined ? 'firefox' : arguments[0];

    _classCallCheck(this, Driver);

    _get(Object.getPrototypeOf(Driver.prototype), 'constructor', this).call(this);

    process.nextTick(function () {
      try {
        var options = {
          desiredCapabilities: {
            browserName: vendor
          }
        };

        _this.driver = _webdriverio2['default'].remote(options).init(function () {
          _this.emit('ready');
        });
      } catch (error) {
        _this.emit('error', error);
      }
    });
  }

  _inherits(Driver, _EventEmitter);

  return Driver;
})(_events.EventEmitter);

exports['default'] = Driver;
module.exports = exports['default'];