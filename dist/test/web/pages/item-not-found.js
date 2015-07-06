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

var _synLibAppDescribe = require('syn/lib/app/Describe');

var _synLibAppDescribe2 = _interopRequireDefault(_synLibAppDescribe);

var _synConfigJson = require('syn/config.json');

var _synConfigJson2 = _interopRequireDefault(_synConfigJson);

var _componentsLayout = require('../components/layout');

var _componentsLayout2 = _interopRequireDefault(_componentsLayout);

var ItemNotFoundPage = (function (_Describe) {
  function ItemNotFoundPage() {
    var _this = this;

    _classCallCheck(this, ItemNotFoundPage);

    _get(Object.getPrototypeOf(ItemNotFoundPage.prototype), 'constructor', this).call(this, 'Item not found Page', {
      'web driver': {
        'uri': '/item/12345/no-such-item'
      }
    });

    this.assert(function () {
      return new _componentsLayout2['default']({ title: _synConfigJson2['default'].title.prefix + 'Item not found' }).driver(_this._driver);
    });
  }

  _inherits(ItemNotFoundPage, _Describe);

  return ItemNotFoundPage;
})(_synLibAppDescribe2['default']);

exports['default'] = ItemNotFoundPage;
module.exports = exports['default'];