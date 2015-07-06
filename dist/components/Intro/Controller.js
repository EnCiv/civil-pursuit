'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synComponentsIntroView = require('syn/components/Intro/View');

var _synComponentsIntroView2 = _interopRequireDefault(_synComponentsIntroView);

var _synLibAppController = require('syn/lib/app/Controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var _synComponentsItemController = require('syn/components/Item/Controller');

var _synComponentsItemController2 = _interopRequireDefault(_synComponentsItemController);

var _synLibUtilReadMore = require('syn/lib/util/ReadMore');

var _synLibUtilReadMore2 = _interopRequireDefault(_synLibUtilReadMore);

var Intro = (function (_Controller) {
  function Intro(props) {
    _classCallCheck(this, Intro);

    _get(Object.getPrototypeOf(Intro.prototype), 'constructor', this).call(this);

    this.props = props;

    this.getIntro();
  }

  _inherits(Intro, _Controller);

  _createClass(Intro, [{
    key: 'template',
    get: function () {
      return $(_synComponentsIntroView2['default'].selector);
    }
  }, {
    key: 'getIntro',
    value: function getIntro() {
      var _this = this;

      this.publish('get intro').subscribe(function (pubsub, intro) {
        _this.set('intro', intro);
        pubsub.unsubscribe();
      });
    }
  }, {
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'panel title':
          return this.template.find('.panel-title');

        case 'item subject':
          return this.template.find('.item-subject a');

        case 'item references':
          return this.template.find('.item-reference');

        case 'item buttons':
          return this.template.find('.item-buttons');

        case 'item arrow':
          return this.template.find('.item-arrow');

        case 'item media':
          return this.template.find('.item-media');

        case 'item image':
          return this.template.find('.item-media img');
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var intro = this.get('intro');

      if (!intro) {
        return this.on('set', function (key) {
          return key === 'intro' && _this2.render();
        });
      }

      this.renderPanel();

      this.renderItem();
    }
  }, {
    key: 'renderPanel',
    value: function renderPanel() {
      var intro = this.get('intro');
      this.find('panel title').text(intro.subject);
    }
  }, {
    key: 'renderItem',
    value: function renderItem() {
      var _this3 = this;

      var intro = this.get('intro');

      this.find('item subject').text(intro.subject);

      this.find('item references').remove();

      this.find('item buttons').remove();

      this.find('item arrow').remove();

      this.find('item media').empty().append(new _synComponentsItemController2['default']({ item: intro }).media());

      this.find('item image').load(function () {
        return (0, _synLibUtilReadMore2['default'])(intro, _this3.template);
      });
    }
  }]);

  return Intro;
})(_synLibAppController2['default']);

exports['default'] = Intro;
module.exports = exports['default'];