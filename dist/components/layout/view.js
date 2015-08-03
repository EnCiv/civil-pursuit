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

var _configJson = require('../../../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _googleAnalyticsView = require('../google-analytics/view');

var _googleAnalyticsView2 = _interopRequireDefault(_googleAnalyticsView);

var _stylesView = require('../styles/view');

var _stylesView2 = _interopRequireDefault(_stylesView);

var _scriptsView = require('../scripts/view');

var _scriptsView2 = _interopRequireDefault(_scriptsView);

var _topBarView = require('../top-bar/view');

var _topBarView2 = _interopRequireDefault(_topBarView);

var _footerView = require('../footer/view');

var _footerView2 = _interopRequireDefault(_footerView);

var _loginView = require('../login/view');

var _loginView2 = _interopRequireDefault(_loginView);

var _joinView = require('../join/view');

var _joinView2 = _interopRequireDefault(_joinView);

var _forgotPasswordView = require('../forgot-password/view');

var _forgotPasswordView2 = _interopRequireDefault(_forgotPasswordView);

var Layout = (function (_Document) {
  function Layout(props) {
    _classCallCheck(this, Layout);

    _get(Object.getPrototypeOf(Layout.prototype), 'constructor', this).call(this);
    this.props = props || {};
    console.log();
    console.log('Layout props', props);
    console.log();
    this.add(this.title(), this.uACompatible(), this.viewport(), new _googleAnalyticsView2['default'](props), new _stylesView2['default'](props), this.screens(), this.header(), this.main(), this.footer(), this.login(), this.join(), this.forgotPassword(), new _scriptsView2['default'](props));
  }

  _inherits(Layout, _Document);

  _createClass(Layout, [{
    key: 'title',
    value: function title() {

      var elem = new _cincoDist.Element('title');

      if (this.props.title) {
        elem.text(_configJson2['default'].title.prefix + this.props.title);
      } else if (this.props.item) {
        elem.text(_configJson2['default'].title.prefix + this.props.item.subject);
      } else {
        elem.text(_configJson2['default'].title.prefix + _configJson2['default'].title['default']);
      }

      return elem;
    }
  }, {
    key: 'uACompatible',
    value: function uACompatible() {
      return new _cincoDist.Element('meta', {
        'http-equiv': 'X-UA-Compatible',
        content: 'IE=edge'
      }).close();
    }
  }, {
    key: 'viewport',
    value: function viewport() {
      return new _cincoDist.Element('meta', {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0'
      }).close();
    }
  }, {
    key: 'screens',
    value: function screens() {
      return new _cincoDist.Element('#screens').add(new _cincoDist.Element('#screen-phone'), new _cincoDist.Element('#screen-tablet'));
    }
  }, {
    key: 'header',
    value: function header() {
      return new _cincoDist.Element('section', { role: 'header' }).add(new _topBarView2['default'](this.props));
    }
  }, {
    key: 'main',
    value: function main() {
      return new _cincoDist.Element('section#main', { role: 'main' });
    }
  }, {
    key: 'footer',
    value: function footer() {
      return new _cincoDist.Element('section#footer', { role: 'footer' }).add(new _footerView2['default'](this.props));
    }
  }, {
    key: 'login',
    value: function login() {
      return new _cincoDist.Element('script#login', { type: 'text/html' }).condition(!this.props.user).text(new _loginView2['default'](this.props).render());
    }
  }, {
    key: 'join',
    value: function join() {
      return new _cincoDist.Element('script#join', { type: 'text/html' }).condition(!this.props.user).text(new _joinView2['default'](this.props).render());
    }
  }, {
    key: 'forgotPassword',
    value: function forgotPassword() {
      return new _cincoDist.Element('script#forgot-password', { type: 'text/html' }).condition(!this.props.user).text(new _forgotPasswordView2['default'](this.props).render());
    }
  }]);

  return Layout;
})(_cincoDist.Document);

exports['default'] = Layout;
module.exports = exports['default'];