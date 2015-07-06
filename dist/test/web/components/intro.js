'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _synLibAppMilk = require('syn/lib/app/milk');

var _synLibAppMilk2 = _interopRequireDefault(_synLibAppMilk);

var _synConfigJson = require('syn/config.json');

var _synConfigJson2 = _interopRequireDefault(_synConfigJson);

var _synModelsType = require('syn/models/type');

var _synModelsType2 = _interopRequireDefault(_synModelsType);

var _synModelsItem = require('syn/models/item');

var _synModelsItem2 = _interopRequireDefault(_synModelsItem);

var _panel = require('./panel');

var _panel2 = _interopRequireDefault(_panel);

var _item = require('./item');

var _item2 = _interopRequireDefault(_item);

var Intro = (function (_Milk) {
  function Intro(props) {
    _classCallCheck(this, Intro);

    props = props || {};

    var options = { viewport: props.viewport };

    _get(Object.getPrototypeOf(Intro.prototype), 'constructor', this).call(this, 'Intro', options);

    this.props = props;

    var get = this.get.bind(this);
    var find = this.find.bind(this);

    var findType = function findType() {
      return _synModelsType2['default'].findOne({ name: 'Intro' }).exec();
    };
    var findIntro = function findIntro() {
      return _synModelsItem2['default'].findOne({ type: get('Type')._id }).exec();
    };

    if (this.props.driver !== false) {
      this.go('/');
    }

    this.set('Type', findType, 'Get Intro\'s type from DB').set('intro', findIntro, 'Get Intro from DB').set('Intro', function () {
      return find('#intro');
    }).set('Panel', function () {
      return find(get('Intro').selector + ' .panel');
    }).set('Title', function () {
      return find(get('Panel').selector + ' .panel-title');
    }).set('Item', function () {
      return find(get('Panel').selector + ' .item');
    }).ok(function () {
      return get('Intro').is(':visible');
    }, 'Intro is visible')['import'](_panel2['default'], function () {
      return {
        panel: get('Panel').selector, creator: false, driver: false
      };
    }).ok(function () {
      return get('Title').text().then(function (text) {
        return text.should.be.exactly(get('intro').subject);
      });
    }, 'Panel title should be Intro\'s subject')['import'](_item2['default'], function () {
      return {
        item: get('intro'),
        collapsers: false,
        buttons: false,
        references: false,
        promote: false,
        details: false,
        element: get('Item')
      };
    });
  }

  _inherits(Intro, _Milk);

  return Intro;
})(_synLibAppMilk2['default']);

exports['default'] = Intro;
module.exports = exports['default'];