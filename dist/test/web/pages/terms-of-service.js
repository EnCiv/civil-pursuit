'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _synLibAppDescribe = require('syn/lib/app/Describe');

var _synLibAppDescribe2 = _interopRequireDefault(_synLibAppDescribe);

var _configJson = require('../../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _componentsLayout = require('../components/layout');

var _componentsLayout2 = _interopRequireDefault(_componentsLayout);

var TOSPage = (function (_Describe) {
  function TOSPage() {
    var _this = this;

    _classCallCheck(this, TOSPage);

    _get(Object.getPrototypeOf(TOSPage.prototype), 'constructor', this).call(this, 'Terms of service page', {
      'web driver': {
        'page': 'Terms Of Service'
      }
    });

    var title = _configJson2['default'].title.prefix + 'Terms of Service';

    this.before('Get Terms of Service source file', function () {
      var TOS = '';

      return new Promise(function (fulfill, reject) {
        _fs2['default'].createReadStream('TOS.md').on('error', function (error) {
          return reject;
        }).on('data', function (data) {
          return TOS += data.toString();
        }).on('end', function () {
          return _this.define('source', (0, _marked2['default'])(TOS));
        }).on('end', function () {
          return fulfill();
        });
      });
    }).assert(function () {
      return new _componentsLayout2['default']({ title: title }).driver(_this._driver);
    }).assert('Page has the same content than source', { html: '#terms-of-service/container' }, function (html) {
      // webdriver bug: sometimes it returns outer HTML instead of inner
      if (/^<div id="terms-of-service\/container">/.test(html)) {
        html = html.replace(/^<div id="terms-of-service\/container">/, '').replace(/<\/div>$/, '');
      }

      // Note that some characters changed because of HTML formatting
      _this._definitions.source = _this._definitions.source.replace(/\&quot;/g, '"').replace(/\&#39;/g, '\'');

      html.should.be.exactly(_this._definitions.source);
    });
  }

  _inherits(TOSPage, _Describe);

  return TOSPage;
})(_synLibAppDescribe2['default']);

exports['default'] = TOSPage;
module.exports = exports['default'];