'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _libAppController = require('../../lib/app/controller');

var _libAppController2 = _interopRequireDefault(_libAppController);

var _panelCtrl = require('../panel/ctrl');

var _panelCtrl2 = _interopRequireDefault(_panelCtrl);

var _controllersRender = require('./controllers/render');

var _controllersRender2 = _interopRequireDefault(_controllersRender);

var _controllersCreate = require('./controllers/create');

var _controllersCreate2 = _interopRequireDefault(_controllersCreate);

var _controllersCreated = require('./controllers/created');

var _controllersCreated2 = _interopRequireDefault(_controllersCreated);

var _controllersPackItem = require('./controllers/pack-item');

var _controllersPackItem2 = _interopRequireDefault(_controllersPackItem);

var _controllersReferences = require('./controllers/references');

var _controllersReferences2 = _interopRequireDefault(_controllersReferences);

var _controllersGetTitle = require('./controllers/get-title');

var _controllersGetTitle2 = _interopRequireDefault(_controllersGetTitle);

var _controllersUpload = require('./controllers/upload');

var _controllersUpload2 = _interopRequireDefault(_controllersUpload);

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
      return $('#' + _panelCtrl2['default'].getId(this.props.panel));
    }
  }, {
    key: 'template',
    get: function () {
      return this.parent.find('>.panel-body > .creator');
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
      return _controllersRender2['default'].apply(this, [cb]);
    }
  }, {
    key: 'renderReferences',
    value: function renderReferences() {
      return _controllersReferences2['default'].apply(this, ['creator']);
    }
  }, {
    key: 'uploader',
    value: function uploader() {
      return _controllersUpload2['default'].apply(this);
    }
  }, {
    key: 'getTitle',
    value: function getTitle(url) {
      return _controllersGetTitle2['default'].apply(this, [url]);
    }
  }, {
    key: 'create',
    value: function create(cb) {
      return _controllersCreate2['default'].apply(this, [cb]);
    }
  }, {
    key: 'packItem',
    value: function packItem(item) {
      return _controllersPackItem2['default'].apply(this, [item]);
    }
  }, {
    key: 'created',
    value: function created(item) {
      return _controllersCreated2['default'].apply(this, [item]);
    }
  }]);

  return Creator;
})(_libAppController2['default']);

exports['default'] = Creator;
module.exports = exports['default'];