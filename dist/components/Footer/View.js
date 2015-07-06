'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoEs5 = require('cinco/es5');

var _synConfigJson = require('syn/config.json');

var _synConfigJson2 = _interopRequireDefault(_synConfigJson);

var _synLibAppPage = require('syn/lib/app/Page');

var _synLibAppPage2 = _interopRequireDefault(_synLibAppPage);

var Footer = (function (_Element) {
  function Footer(props) {
    _classCallCheck(this, Footer);

    _get(Object.getPrototypeOf(Footer.prototype), 'constructor', this).call(this, 'footer.padding');
    this.props = props;
    this.add(new _cincoEs5.Element('p').text(function () {
      var y = new Date().getFullYear();

      return 'Copyright Ⓒ 2014 ' + (y > 2014 ? ' - ' + y : '') + ' by Synaccord.';
    }), new _cincoEs5.Element('p').add(new _cincoEs5.Element('a', {
      href: (0, _synLibAppPage2['default'])('Terms Of Service')
    }).text('Terms of Service and Privacy Policy')));
  }

  _inherits(Footer, _Element);

  return Footer;
})(_cincoEs5.Element);

exports['default'] = Footer;
module.exports = exports['default'];