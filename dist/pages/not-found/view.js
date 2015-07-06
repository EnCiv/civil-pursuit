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

var PageNotFound = (function (_Layout) {
  function PageNotFound(props) {
    _classCallCheck(this, PageNotFound);

    props = props || {};

    props.title = props.title || 'Page not found';

    _get(Object.getPrototypeOf(PageNotFound.prototype), 'constructor', this).call(this, props);

    var main = this.find('#main').get(0);

    main.add(new _cincoDist.Element('h1.gutter.warning').text(props.title), new _cincoDist.Element('p.gutter').text('We are sorry, your request could not be fulfilled because no relevant results were found.'), new _cincoDist.Element('hr'));
  }

  _inherits(PageNotFound, _Layout);

  return PageNotFound;
})(_componentsLayoutView2['default']);

exports['default'] = PageNotFound;
module.exports = exports['default'];