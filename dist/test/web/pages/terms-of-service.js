'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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

var _libAppMilk = require('../../../lib/app/milk');

var _libAppMilk2 = _interopRequireDefault(_libAppMilk);

var _configJson = require('../../../../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _componentsLayout = require('../components/layout');

var _componentsLayout2 = _interopRequireDefault(_componentsLayout);

var TOSPage = (function (_Milk) {
  function TOSPage(props) {
    _classCallCheck(this, TOSPage);

    props = props || {};

    var options = { viewport: props.viewport, vendor: props.vendor };

    _get(Object.getPrototypeOf(TOSPage.prototype), 'constructor', this).call(this, 'Terms of Service Page', options);

    this.go('/page/terms-of-service')['import'](_componentsLayout2['default'], {
      title: _configJson2['default'].title.prefix + 'Terms of Service'
    });

    this.actors();

    this.stories();
  }

  _inherits(TOSPage, _Milk);

  _createClass(TOSPage, [{
    key: 'actors',
    value: function actors() {
      var _this = this;

      this.set('Container', function () {
        return _this.find('#terms-of-service/container');
      });

      this.set('Markup', function () {
        return new Promise(function (ok, ko) {
          var TOS = '';

          _fs2['default'].createReadStream('TOS.md').on('error', function (error) {
            return ko;
          }).on('data', function (data) {
            return TOS += data.toString();
          }).on('end', function () {
            return ok((0, _marked2['default'])(TOS));
          });
        });
      });
    }
  }, {
    key: 'stories',
    value: function stories() {
      var _this2 = this;

      this.ok(function () {
        return _this2.get('Container').html().then(function (html) {

          var markup = /^<div class="gutter" id="terms-of-service\/container">/;

          // webdriver bug: sometimes it returns outer HTML instead of inner
          if (markup.test(html)) {
            html = html.replace(markup, '').replace(/<\/div>$/, '');
          }

          // Note that some characters changed because of HTML formatting
          var md = _this2.get('Markup').replace(/\&quot;/g, '"').replace(/\&#39;/g, '\'');

          html.should.be.exactly(md);
        });
      });
    }
  }]);

  return TOSPage;
})(_libAppMilk2['default']);

exports['default'] = TOSPage;
module.exports = exports['default'];