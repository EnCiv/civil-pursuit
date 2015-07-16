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

var _modelsType = require('../../../models/type');

var _modelsType2 = _interopRequireDefault(_modelsType);

var _modelsItem = require('../../../models/item');

var _modelsItem2 = _interopRequireDefault(_modelsItem);

var _panel = require('./panel');

var _panel2 = _interopRequireDefault(_panel);

var _item = require('./item');

var _item2 = _interopRequireDefault(_item);

var TopLevelPanel = (function (_Milk) {
  function TopLevelPanel(props) {
    var _this = this;

    _classCallCheck(this, TopLevelPanel);

    props = props || {};

    var options = { viewport: props.viewport, session: props.session };

    _get(Object.getPrototypeOf(TopLevelPanel.prototype), 'constructor', this).call(this, 'Top Level Panel', options);

    this.props = props || {};

    var get = this.get.bind(this);
    var find = this.find.bind(this);
    var findType = function findType() {
      return _modelsType2['default'].findOne({ name: 'Topic' }).exec();
    };
    var findItems = function findItems() {
      return _modelsItem2['default'].getPanelItems({ type: get('Type')._id });
    };

    this.set('Type', findType, 'Fetch top level type (Topic) from db');

    this.set('Items', findItems, 'Fetch top level items from DB');

    if (this.props.driver !== false) {
      this.go('/');
    }

    this.set('Top Level Panel', function () {
      return find('#panel-' + get('Type')._id);
    }).ok(function () {
      return find('.panels').is(':visible');
    }).wait(2)['import'](_panel2['default'], function () {
      return {
        driver: false,
        panel: get('Top Level Panel').selector,
        viewport: options.viewport
      };
    }).ok(function () {
      return get('Top Level Panel').count('.item[id]:not(.new)').then(function (children) {
        return children.should.be.exactly(7);
      });
    }).each(function () {
      return get('Items');
    }, function (item) {
      return _this['import'](_item2['default'], function () {
        return {
          driver: false,
          item: item,
          viewport: options.viewport
        };
      }, 'Panel item is an Item component');
    }, 'Each panel item is an Item component');
  }

  _inherits(TopLevelPanel, _Milk);

  return TopLevelPanel;
})(_libAppMilk2['default']);

exports['default'] = TopLevelPanel;
module.exports = exports['default'];