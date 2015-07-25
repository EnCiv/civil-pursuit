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

var _creatorControllersUpload = require('../creator/controllers/upload');

var _creatorControllersUpload2 = _interopRequireDefault(_creatorControllersUpload);

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

        case 'upload image button':
          return this.template.find('.upload-image-button');
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      this.template.find('[name="subject"]').val(this.item.get('item').subject);

      this.template.find('[name="description"]').val(this.item.get('item').description).autogrow();

      if (this.item.get('item').references.length) {
        this.template.find('[name="reference"]').val(this.item.get('item').references[0].url);
      }

      // Media

      this.template.find('.item-media').empty().append(this.item.media());

      // Upload image

      var chooseAnotherImage = $('<div class="text-center gutter"></div>');
      var chooseAnotherImageLink = $('<a href="">Choose another image</a>');
      var closeChooseAnotherImage = $('<i class="fa fa-times cursor-pointer"></i>');
      var gap = $('<span> </span>');

      chooseAnotherImage.append(closeChooseAnotherImage, gap, chooseAnotherImageLink);

      chooseAnotherImageLink.on('click', function (e) {
        e.preventDefault();
        var dropbox = _this.template.find('.drop-box');
        var itemMedia = _this.template.find('.item-media');
        if (dropbox.css('display') === 'none') {
          dropbox.css('display', 'block');
          itemMedia.find('>img, >iframe').css('display', 'none');
          itemMedia.find('.fa-times').css('display', 'inline');
        }
      });

      closeChooseAnotherImage.on('click', function (e) {
        var dropbox = _this.template.find('.drop-box');
        var itemMedia = _this.template.find('.item-media');

        if (dropbox.css('display') === 'block') {
          dropbox.css('display', 'none');
          itemMedia.find('>img, >iframe').css('display', 'inline');
          itemMedia.find('.fa-times').css('display', 'none');
        }
      });

      this.template.find('.item-media').append(chooseAnotherImage).append($('.drop-box'));

      this.template.find('.drop-box').css('display', 'none');
      this.template.find('.item-media .fa-times').css('display', 'none');

      // References

      this.renderReferences();

      // Uploader

      this.uploader();

      // Form

      var form = new _libUtilForm2['default'](this.template);

      form.send(this.save.bind(this));
    }
  }, {
    key: 'renderReferences',
    value: function renderReferences() {
      return _creatorControllersReferences2['default'].apply(this, ['editor']);
    }
  }, {
    key: 'uploader',
    value: function uploader() {
      return _creatorControllersUpload2['default'].apply(this);
    }
  }, {
    key: 'getTitle',
    value: function getTitle(url) {
      return _creatorControllersGetTitle2['default'].apply(this, [url]);
    }
  }, {
    key: 'save',
    value: function save() {
      var _this2 = this;

      _libUtilNav2['default'].hide(this.template, this.domain.intercept(function () {
        _libUtilNav2['default'].hide(_this2.template.closest('.edit-and-go-again'), _this2.domain.intercept(function () {

          var newItem = _this2.toItem();

          _this2.publish('create item', newItem).subscribe(function (pubsub, document) {
            pubsub.unsubscribe();

            var item = new _itemCtrl2['default']({ item: document });

            item.load();

            item.template.insertBefore(_this2.item.template);

            item.render(_this2.domain.intercept(function () {
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