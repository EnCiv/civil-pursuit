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

var _libAppMilk = require('../../../lib/app/milk');

var _libAppMilk2 = _interopRequireDefault(_libAppMilk);

var _configJson = require('../../../../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _componentsLayout = require('../components/layout');

var _componentsLayout2 = _interopRequireDefault(_componentsLayout);

var _componentsJoin = require('../components/join');

var _componentsJoin2 = _interopRequireDefault(_componentsJoin);

var ErrorPage = (function (_Milk) {
  function ErrorPage(props) {
    _classCallCheck(this, ErrorPage);

    props = props || {};

    var options = {
      viewport: props.viewport,
      vendor: props.vendor,
      env: props.env || 'production'
    };

    _get(Object.getPrototypeOf(ErrorPage.prototype), 'constructor', this).call(this, 'Error Page', options);

    this.options = options;

    this.go('/error');

    this.actors();

    this.stories();
  }

  _inherits(ErrorPage, _Milk);

  _createClass(ErrorPage, [{
    key: 'actors',
    value: function actors() {
      var _this = this;

      this.set('Header', function () {
        return _this.find('#main h1');
      });
      this.set('Text', function () {
        return _this.find('#main p');
      });
      this.set('Stack', function () {
        return _this.find('#main ul');
      });
    }
  }, {
    key: 'stories',
    value: function stories() {
      var _this2 = this;

      this['import'](_componentsLayout2['default'], {
        title: _configJson2['default'].title.prefix + 'Error'
      }).ok(function () {
        return _this2.get('Header').text().then(function (text) {
          return text.should.be.exactly('Error');
        });
      }, 'Header should say "Error"').ok(function () {
        return _this2.get('Text').text().then(function (text) {
          return text.should.be.exactly('An error occurred. Please try again in a moment');
        });
      }, 'Text should say "An error occurred. Please try again in a moment"', function () {
        return _this2.options.env === 'production';
      }).ok(function () {
        return _this2.get('Stack').is(':visible');
      }, 'There should be an error stack', function () {
        return _this2.options.env === 'development';
      })['import'](_componentsJoin2['default'], { toggled: false, viewport: this.options.viewport })['import'](_componentsLayout2['default'], {
        title: _configJson2['default'].title.prefix + 'Error'
      });
    }
  }]);

  return ErrorPage;
})(_libAppMilk2['default']);

exports['default'] = ErrorPage;
module.exports = exports['default'];