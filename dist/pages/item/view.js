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

var _componentsItemView = require('../../components/item/view');

var _componentsItemView2 = _interopRequireDefault(_componentsItemView);

var _componentsPanelView = require('../../components/panel/view');

var _componentsPanelView2 = _interopRequireDefault(_componentsPanelView);

var ItemPage = (function (_Layout) {
  function ItemPage(props) {
    _classCallCheck(this, ItemPage);

    _get(Object.getPrototypeOf(ItemPage.prototype), 'constructor', this).call(this, props);
    this.props = props;

    var panel = new _componentsPanelView2['default'](props);

    var item = new _componentsItemView2['default'](props);

    panel.find('h4.panel-title').each(function (title) {
      title.text(props.item.subject);
    });

    panel.find('.items').each(function (body) {
      body.add(item);
    });

    var main = this.find('#main').get(0);

    main.add(panel);
  }

  _inherits(ItemPage, _Layout);

  return ItemPage;
})(_componentsLayoutView2['default']);

exports['default'] = ItemPage;
module.exports = exports['default'];