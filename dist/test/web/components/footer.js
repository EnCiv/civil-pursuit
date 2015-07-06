'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synLibAppMilk = require('syn/lib/app/milk');

var _synLibAppMilk2 = _interopRequireDefault(_synLibAppMilk);

var _synLibAppPage = require('syn/lib/app/page');

var _synLibAppPage2 = _interopRequireDefault(_synLibAppPage);

var Footer = (function (_Milk) {
  function Footer(props) {
    var _this = this;

    _classCallCheck(this, Footer);

    props = props || {};

    var options = { viewport: props.viewport };

    _get(Object.getPrototypeOf(Footer.prototype), 'constructor', this).call(this, 'Footer', options);

    this.props = props;

    if (this.props.driver !== false) {
      this.go('/');
    }

    this.ok(function () {
      return _this.find('#footer').is(':visible');
    }).ok(function () {
      return _this.find('#footer ' + 'a[href="' + (0, _synLibAppPage2['default'])('Terms Of Service') + '"]').is(':visible');
    });
  }

  _inherits(Footer, _Milk);

  return Footer;
})(_synLibAppMilk2['default']);

exports['default'] = Footer;
module.exports = exports['default'];