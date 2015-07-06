'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoEs5 = require('cinco/es5');

var _synConfig = require('syn/config');

var _synConfig2 = _interopRequireDefault(_synConfig);

var _synComponentsGoogleAnalyticsView = require('syn/components/GoogleAnalytics/View');

var _synComponentsGoogleAnalyticsView2 = _interopRequireDefault(_synComponentsGoogleAnalyticsView);

var _synComponentsStylesView = require('syn/components/Styles/View');

var _synComponentsStylesView2 = _interopRequireDefault(_synComponentsStylesView);

var _synComponentsScriptsView = require('syn/components/Scripts/View');

var _synComponentsScriptsView2 = _interopRequireDefault(_synComponentsScriptsView);

var _synComponentsTopBarView = require('syn/components/TopBar/View');

var _synComponentsTopBarView2 = _interopRequireDefault(_synComponentsTopBarView);

var _synComponentsFooterView = require('syn/components/Footer/View');

var _synComponentsFooterView2 = _interopRequireDefault(_synComponentsFooterView);

var _synComponentsLoginView = require('syn/components/Login/View');

var _synComponentsLoginView2 = _interopRequireDefault(_synComponentsLoginView);

var _synComponentsJoinView = require('syn/components/Join/View');

var _synComponentsJoinView2 = _interopRequireDefault(_synComponentsJoinView);

var Layout = (function (_Document) {
  function Layout(props) {
    _classCallCheck(this, Layout);

    _get(Object.getPrototypeOf(Layout.prototype), 'constructor', this).call(this);
    this.props = props || {};
    console.log();
    console.log('Layout props', props);
    console.log();
    this.add(this.title(), this.uACompatible(), this.viewport(), new _synComponentsGoogleAnalyticsView2['default'](props), new _synComponentsStylesView2['default'](props), this.screens(), this.header(), this.main(), this.footer(), this.login(), this.join(), new _synComponentsScriptsView2['default'](props));
  }

  _inherits(Layout, _Document);

  _createClass(Layout, [{
    key: 'title',
    value: function title() {

      var elem = new _cincoEs5.Element('title');

      if (this.props.title) {
        elem.text(_synConfig2['default'].title.prefix + this.props.title);
      } else if (this.props.item) {
        elem.text(_synConfig2['default'].title.prefix + this.props.item.subject);
      } else {
        elem.text(_synConfig2['default'].title.prefix + _synConfig2['default'].title['default']);
      }

      return elem;
    }
  }, {
    key: 'uACompatible',
    value: function uACompatible() {
      return new _cincoEs5.Element('meta', {
        'http-equiv': 'X-UA-Compatible',
        content: 'IE=edge'
      }).close();
    }
  }, {
    key: 'viewport',
    value: function viewport() {
      return new _cincoEs5.Element('meta', {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0'
      }).close();
    }
  }, {
    key: 'screens',
    value: function screens() {
      return new _cincoEs5.Element('#screens').add(new _cincoEs5.Element('#screen-phone'), new _cincoEs5.Element('#screen-tablet'));
    }
  }, {
    key: 'header',
    value: function header() {
      return new _cincoEs5.Element('section', { role: 'header' }).add(new _synComponentsTopBarView2['default'](this.props));
    }
  }, {
    key: 'main',
    value: function main() {
      return new _cincoEs5.Element('section#main', { role: 'main' });
    }
  }, {
    key: 'footer',
    value: function footer() {
      return new _cincoEs5.Element('section#footer', { role: 'footer' }).add(new _synComponentsFooterView2['default'](this.props));
    }
  }, {
    key: 'login',
    value: function login() {
      return new _cincoEs5.Element('script#login', { type: 'text/html' }).condition(!this.props.user).text(new _synComponentsLoginView2['default'](this.props).render());
    }
  }, {
    key: 'join',
    value: function join() {
      return new _cincoEs5.Element('script#join', { type: 'text/html' }).condition(!this.props.user).text(new _synComponentsJoinView2['default'](this.props).render());
    }
  }]);

  return Layout;
})(_cincoEs5.Document);

exports['default'] = Layout;
module.exports = exports['default'];