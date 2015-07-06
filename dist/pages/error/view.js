'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _componentsLayoutView = require('../../components/layout/view');

var _componentsLayoutView2 = _interopRequireDefault(_componentsLayoutView);

var _cincoDist = require('cinco/dist');

var ErrorPage = (function (_Layout) {
  function ErrorPage(props) {
    _classCallCheck(this, ErrorPage);

    props = props || {};

    props.title = props.title || 'Error';

    _get(Object.getPrototypeOf(ErrorPage.prototype), 'constructor', this).call(this, props);

    var main = this.find('#main').get(0);

    main.add(new _cincoDist.Element('h1.gutter.error').text(props.title));

    var ul = new _cincoDist.Element('ul');

    if (props.settings.env === 'development') {
      props.error.forEach(function (line) {
        ul.add(new _cincoDist.Element('li').text(line));
      });

      main.add(ul);
    } else {
      main.add(new _cincoDist.Element('p').text('An error occurred. Please try again in a moment'));
    }

    main.add(new _cincoDist.Element('hr'));
  }

  _inherits(ErrorPage, _Layout);

  return ErrorPage;
})(_componentsLayoutView2['default']);

exports['default'] = ErrorPage;
module.exports = exports['default'];