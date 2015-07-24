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

var _libUtilNav = require('../../lib/util/nav');

var _libUtilNav2 = _interopRequireDefault(_libUtilNav);

var _libUtilForm = require('../../lib/util/form');

var _libUtilForm2 = _interopRequireDefault(_libUtilForm);

var _view = require('./view');

var _view2 = _interopRequireDefault(_view);

var _itemCtrl = require('../item/ctrl');

var _itemCtrl2 = _interopRequireDefault(_itemCtrl);

var _creatorControllersReferences = require('../creator/controllers/references');

var _creatorControllersReferences2 = _interopRequireDefault(_creatorControllersReferences);

var _creatorControllersGetTitle = require('../creator/controllers/get-title');

var _creatorControllersGetTitle2 = _interopRequireDefault(_creatorControllersGetTitle);

var EditAndGoAgainCtrl = (function (_Controller) {
  function EditAndGoAgainCtrl(props) {
    _classCallCheck(this, EditAndGoAgainCtrl);

    _get(Object.getPrototypeOf(EditAndGoAgainCtrl.prototype), 'constructor', this).call(this);

    this.item = props.item;

    this.find = this.find.bind(this);
  }

  _inherits(EditAndGoAgainCtrl, _Controller);

  _createClass(EditAndGoAgainCtrl, [{
    key: 'load',
    value: function load() {
      this.template = $(new _view2['default']().render());
      this.template.data('editor', this);
    }
  }, {
    key: 'find',
    value: function find(name) {
      switch (name) {
        case '?':
          return 'this';

        case 'create button':
          return this.template.find('.button-create:first');

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
      }
    }
  }, {
    key: 'render',
    value: function render() {

      this.template.find('[name="subject"]').val(this.item.get('item').subject);

      this.template.find('[name="description"]').val(this.item.get('item').description).autogrow();

      if (this.item.get('item').references.length) {
        this.template.find('[name="reference"]').val(this.item.get('item').references[0].url);
      }

      this.template.find('.item-media').empty().append(this.item.media());

      // References

      this.renderReferences();

      var form = new _libUtilForm2['default'](this.template);

      form.send(this.save.bind(this));
    }
  }, {
    key: 'renderReferences',
    value: function renderReferences() {
      return _creatorControllersReferences2['default'].apply(this, ['editor']);
    }
  }, {
    key: 'getTitle',
    value: function getTitle(url) {
      return _creatorControllersGetTitle2['default'].apply(this, [url]);
    }
  }, {
    key: 'save',
    value: function save() {
      var _this = this;

      _libUtilNav2['default'].hide(this.template, this.domain.intercept(function () {
        _libUtilNav2['default'].hide(_this.template.closest('.edit-and-go-again'), _this.domain.intercept(function () {

          var newItem = _this.toItem();

          _this.publish('create item', newItem).subscribe(function (pubsub, document) {
            pubsub.unsubscribe();

            var item = new _itemCtrl2['default']({ item: document });

            item.load();

            item.template.insertBefore(_this.item.template);

            item.render(_this.domain.intercept(function () {
              item.find('toggle promote').click();
            }));
          });
        }));
      }));
    }
  }, {
    key: 'toItem',
    value: function toItem() {
      var item = {
        from: this.item.get('item')._id,
        subject: this.template.find('[name="subject"]').val(), /* 2 */
        description: this.template.find('[name="description"]').val(),
        user: this.socket.synuser,
        type: this.item.get('item').type
      };

      if (this.template.find('.item-media').find('img').length) {

        if (this.template.find('.item-media').find('.youtube-preview').length) {
          item.youtube = this.template.find('.item-media').find('.youtube-preview').data('video');
        } else {
          item.upload = this.template.find('.item-media').find('img').attr('src');
        }
      }

      return item;
    }
  }]);

  return EditAndGoAgainCtrl;
})(_libAppController2['default']);

exports['default'] = EditAndGoAgainCtrl;
module.exports = exports['default'];