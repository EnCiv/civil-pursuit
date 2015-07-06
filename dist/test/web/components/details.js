'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _libAppMilk = require('../../../lib/app/milk');

var _libAppMilk2 = _interopRequireDefault(_libAppMilk);

var Details = (function (_Milk) {
  function Details(props) {
    _classCallCheck(this, Details);

    props = props || {};

    var options = { viewport: props.viewport };

    _get(Object.getPrototypeOf(Details.prototype), 'constructor', this).call(this, 'Details', options);

    this.props = props;

    var get = this.get.bind(this);
    var find = this.find.bind(this);

    var item = this.props.item;

    this.set('Item', function () {
      return find('#item-' + item._id);
    });

    this.set('Main', function () {
      return find(get('Item').selector + ' > .item-collapsers > .details');
    });

    this.set('Promotion bar', function () {
      return find(get('Main').selector + ' .progressBar');
    });

    if (this.props.driver !== false) {
      this.go('/');
    }

    this.ok(function () {
      return get('Item').is(':visible');
    }, 'Item is visible');
    this.ok(function () {
      return get('Main').is(':visible');
    }, 'Details is visible');
    this.ok(function () {
      return get('Promotion bar').is(':visible');
    }, 'Promotion bar is visible');

    this.ok(function () {
      return get('Promotion bar').text().then(function (text) {
        return text.should.be.exactly(item.popularity.number + '%');
      });
    }, 'Promotion bar shows the right percentage');
  }

  _inherits(Details, _Milk);

  return Details;
})(_libAppMilk2['default']);

exports['default'] = Details;
module.exports = exports['default'];