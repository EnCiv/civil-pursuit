'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synLibAppController = require('syn/lib/app/Controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var _synComponentsPanelController = require('syn/components/Panel/Controller');

var _synComponentsPanelController2 = _interopRequireDefault(_synComponentsPanelController);

var _synComponentsCreatorControllersRender = require('syn/components/Creator/controllers/render');

var _synComponentsCreatorControllersRender2 = _interopRequireDefault(_synComponentsCreatorControllersRender);

var _synComponentsCreatorControllersCreate = require('syn/components/Creator/controllers/create');

var _synComponentsCreatorControllersCreate2 = _interopRequireDefault(_synComponentsCreatorControllersCreate);

var _synComponentsCreatorControllersCreated = require('syn/components/Creator/controllers/created');

var _synComponentsCreatorControllersCreated2 = _interopRequireDefault(_synComponentsCreatorControllersCreated);

var _synComponentsCreatorControllersPackItem = require('syn/components/Creator/controllers/pack-item');

var _synComponentsCreatorControllersPackItem2 = _interopRequireDefault(_synComponentsCreatorControllersPackItem);

var text = {
  'looking up title': 'Looking up'
};

var Creator = (function (_Controller) {
  function Creator(props, panelContainer) {
    _classCallCheck(this, Creator);

    _get(Object.getPrototypeOf(Creator.prototype), 'constructor', this).call(this);

    this.props = props || {};

    this.panel = props.panel;

    this.panelContainer = panelContainer;
  }

  _inherits(Creator, _Controller);

  _createClass(Creator, [{
    key: 'parent',
    get: function () {
      return $('#' + _synComponentsPanelController2['default'].getId(this.props.panel));
    }
  }, {
    key: 'template',
    get: function () {
      return this.parent.find('.creator:first');
    }
  }, {
    key: 'getTitle',
    value: function getTitle(url) {
      var _this = this;

      console.info('get title', url);
      return new Promise(function (ok, ko) {
        _this.publish('get url title', url).subscribe(function (pubsub, title) {
          console.info('get title', title);
          ok(title);
          pubsub.unsubscribe();
        });
      });
    }
  }, {
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'create button':
          return this.template.find('.button-create:first');

        case 'form':
          return this.template.find('form');

        case 'dropbox':
          return this.template.find('.drop-box');

        case 'subject':
          return this.template.find('[name="subject"]');

        case 'description':
          return this.template.find('[name="description"]');

        case 'item media':
          return this.template.find('.item-media');

        case 'reference':
          return this.template.find('.reference');

        case 'reference board':
          return this.template.find('.reference-board');

        case 'upload image button':
          return this.template.find('.upload-image-button');
      }
    }
  }, {
    key: 'render',
    value: function render(cb) {
      return _synComponentsCreatorControllersRender2['default'].apply(this, [cb]);
    }
  }, {
    key: 'create',
    value: function create(cb) {
      return _synComponentsCreatorControllersCreate2['default'].apply(this, [cb]);
    }
  }, {
    key: 'packItem',
    value: function packItem(item) {
      return _synComponentsCreatorControllersPackItem2['default'].apply(this, [item]);
    }
  }, {
    key: 'created',
    value: function created(item) {
      return _synComponentsCreatorControllersCreated2['default'].apply(this, [item]);
    }
  }]);

  return Creator;
})(_synLibAppController2['default']);

exports['default'] = Creator;
module.exports = exports['default'];