'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoDist = require('cinco/dist');

var _publicJson = require('../../../public.json');

var _publicJson2 = _interopRequireDefault(_publicJson);

var Stylesheet = (function (_Element) {
  function Stylesheet(href) {
    _classCallCheck(this, Stylesheet);

    _get(Object.getPrototypeOf(Stylesheet.prototype), 'constructor', this).call(this, 'link', { rel: 'stylesheet', type: 'text/css', href: href });
    this.close();
  }

  _inherits(Stylesheet, _Element);

  return Stylesheet;
})(_cincoDist.Element);

var Stylesheets = (function (_Element2) {
  function Stylesheets(props) {
    _classCallCheck(this, Stylesheets);

    _get(Object.getPrototypeOf(Stylesheets.prototype), 'constructor', this).call(this, 'styles');
    this.props = props;
    this.add(this.reset(), this.assets(), this.app(), this.fontAwesome(), this.vex(), this.vexTheme(), this.c3(), this.tooltip(), this.goalProgress());
  }

  _inherits(Stylesheets, _Element2);

  _createClass(Stylesheets, [{
    key: 'isProd',
    value: function isProd() {
      return this.props.settings.env === 'production';
    }
  }, {
    key: 'reset',
    value: function reset() {
      if (!this.isProd()) {
        return new Stylesheet('/assets/css/normalize.css');
      }
    }
  }, {
    key: 'app',
    value: function app() {
      var _this = this;

      return new Stylesheet(function () {
        return _this.isProd() ? '/css/index.min.css' : '/css/index.css';
      });
    }
  }, {
    key: 'assets',
    value: function assets() {
      if (this.isProd()) {
        return new Stylesheet('/css/assets.min.css');
      }
    }
  }, {
    key: 'fontAwesome',
    value: function fontAwesome() {
      var _this2 = this;

      return new Stylesheet(function () {
        return _this2.isProd() ? _publicJson2['default']['font awesome'].cdn : '/assets/bower_components/font-awesome/css/font-awesome.css';
      });
    }
  }, {
    key: 'vex',
    value: function vex() {
      if (!this.isProd()) {
        return new Stylesheet('/assets/assets/vex-2.2.1/css/vex.css');
      }
    }
  }, {
    key: 'vexTheme',
    value: function vexTheme() {
      if (!this.isProd()) {
        return new Stylesheet('/assets/assets/vex-2.2.1/css/vex-theme-flat-attack.css');
      }
    }
  }, {
    key: 'c3',
    value: function c3() {
      if (!this.isProd()) {
        return new Stylesheet('/assets/bower_components/c3/c3.css');
      }
    }
  }, {
    key: 'tooltip',
    value: function tooltip() {
      if (!this.isProd()) {
        return new Stylesheet('/assets/assets/toolkit/tooltip.css');
      }
    }
  }, {
    key: 'goalProgress',
    value: function goalProgress() {
      if (!this.isProd()) {
        return new Stylesheet('/assets/bower_components/goalProgress/goalProgress.css');
      }
    }
  }]);

  return Stylesheets;
})(_cincoDist.Element);

exports['default'] = Stylesheets;
module.exports = exports['default'];