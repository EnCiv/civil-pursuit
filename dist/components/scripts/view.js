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

var _synConfigJson = require('syn/config.json');

var _synConfigJson2 = _interopRequireDefault(_synConfigJson);

var _string = require('string');

var _string2 = _interopRequireDefault(_string);

var Scripts = (function (_Elements) {
  function Scripts(props) {
    _classCallCheck(this, Scripts);

    _get(Object.getPrototypeOf(Scripts.prototype), 'constructor', this).call(this);
    this.props = props || {};

    if (this.isProd()) {
      this.add(this.globals(), this.socketIO(), this.jQuery(), this.app(), this.assets());
    } else {
      this.add(this.globals(), this.socketIO(), this.jQuery(), this.autogrow(), this.app(), this.vex(), this.socketStream(), this.goalProgress(), this.d3(), this.c3());
    }
  }

  _inherits(Scripts, _Elements);

  _createClass(Scripts, [{
    key: 'isProd',
    value: function isProd() {
      return this.props.settings.env === 'production';
    }
  }, {
    key: 'globals',
    value: function globals() {
      var _this = this;

      return new _cincoDist.Element('script').text(function () {
        var synapp = { config: _this.props.config, props: _this.props };

        return 'window.synapp = ' + JSON.stringify(synapp);
      });
    }
  }, {
    key: 'socketIO',
    value: function socketIO() {
      return new _cincoDist.Element('script', { src: '/socket.io/socket.io.js' });
    }
  }, {
    key: 'socketStream',
    value: function socketStream() {
      return new _cincoDist.Element('script', { src: '/assets/js/socket.io-stream.js' });
    }
  }, {
    key: 'jQuery',
    value: function jQuery() {
      var _this2 = this;

      return new _cincoDist.Element('script', { src: function src() {
          return _this2.props.settings.env === 'production' ? _synConfigJson2['default'].jquery.cdn : '/assets/bower_components/jquery/dist/jquery.js';
        } });
    }
  }, {
    key: 'autogrow',
    value: function autogrow() {
      return new _cincoDist.Element('script', { src: '/assets/js/autogrow.js' });
    }
  }, {
    key: 'app',
    value: function app() {
      var _this3 = this;

      return new _cincoDist.Element('script', { src: function src() {
          var ext = '.js';

          if (_this3.isProd()) {
            ext = '.min.js';
          }

          var page = _this3.props.page || 'home';

          return '/js/pages/' + (0, _string2['default'])(page).humanize().slugify().s + '/bundle' + ext;
        } });
    }
  }, {
    key: 'vex',
    value: function vex() {
      return new _cincoDist.Element('script', {
        src: '/assets/assets/vex-2.2.1/js/vex.combined.min.js'
      });
    }
  }, {
    key: 'goalProgress',
    value: function goalProgress() {
      return new _cincoDist.Element('script', { src: '/assets/bower_components/goalProgress/goalProgress.js' });
    }
  }, {
    key: 'd3',
    value: function d3() {
      var _this4 = this;

      return new _cincoDist.Element('script', { src: function src() {
          return _this4.props.settings.env === 'production' ? '/assets/bower_components/d3/d3.min.js' : '/assets/bower_components/d3/d3.js';
        } });
    }
  }, {
    key: 'c3',
    value: function c3() {
      var _this5 = this;

      return new _cincoDist.Element('script', { src: function src() {
          return _this5.props.settings.env === 'production' ? '/assets/bower_components/c3/c3.min.js' : '/assets/bower_components/c3/c3.js';
        } });
    }
  }, {
    key: 'assets',
    value: function assets() {
      return new _cincoDist.Element('script', { src: '/assets/js/assets.min.js' });
    }
  }]);

  return Scripts;
})(_cincoDist.Elements);

exports['default'] = Scripts;
module.exports = exports['default'];