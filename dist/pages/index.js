'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoDist = require('cinco/dist');

var _publicJson = require('../../public.json');

var _publicJson2 = _interopRequireDefault(_publicJson);

var Stylesheet = (function (_Element) {
  function Stylesheet(href) {
    _classCallCheck(this, Stylesheet);

    _get(Object.getPrototypeOf(Stylesheet.prototype), 'constructor', this).call(this, 'link', { rel: 'stylesheet', href: href });
    this.close();
  }

  _inherits(Stylesheet, _Element);

  return Stylesheet;
})(_cincoDist.Element);

var Script = (function (_Element2) {
  function Script(src) {
    _classCallCheck(this, Script);

    if (src) {
      _get(Object.getPrototypeOf(Script.prototype), 'constructor', this).call(this, 'script', { src: src });
    } else {
      _get(Object.getPrototypeOf(Script.prototype), 'constructor', this).call(this, 'script');
    }
  }

  _inherits(Script, _Element2);

  return Script;
})(_cincoDist.Element);

var Layout = (function (_Document) {
  function Layout() {
    var props = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Layout);

    console.log(props);

    _get(Object.getPrototypeOf(Layout.prototype), 'constructor', this).call(this, props);
    this.props = props;

    var intro = JSON.stringify(this.props.intro);

    this.add(this.uACompatible(), this.viewport());

    if (props.env === 'development') {
      this.add(new Stylesheet('/assets/css/normalize.css'), new Stylesheet('/assets/css/index.css'), new Stylesheet('/assets/bower_components/font-awesome/css/font-awesome.css'), new Stylesheet('/assets/bower_components/c3/c3.css'), new Stylesheet('/assets/bower_components/goalProgress/goalProgress.css'));
    } else {
      this.add(new Stylesheet('/assets/css/index.min.css'), new Stylesheet(_publicJson2['default']['font awesome'].cdn));
    }

    this.add(this.container());

    this.add(new Script().text('window.synapp = { "intro" : ' + intro + '}'));

    if (props.env === 'development') {
      this.add(new Script('/socket.io/socket.io.js'), new Script('/assets/js/main.js'), new Script('/assets/js/socket.io-stream.js'));
    } else {
      this.add(new Script('/socket.io/socket.io.js'), new Script('/assets/js/main.min.js'), new Script('/assets/js/socket.io-stream.js'));
    }
  }

  _inherits(Layout, _Document);

  _createClass(Layout, [{
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
    key: 'container',
    value: function container() {
      return new _cincoDist.Element('#synapp').text('<!-- #synapp -->');
    }
  }]);

  return Layout;
})(_cincoDist.Document);

exports['default'] = Layout;
module.exports = exports['default'];