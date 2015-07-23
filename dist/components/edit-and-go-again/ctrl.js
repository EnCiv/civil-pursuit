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

var EditAndGoAgainCtrl = (function (_Controller) {
  function EditAndGoAgainCtrl(props) {
    _classCallCheck(this, EditAndGoAgainCtrl);

    _get(Object.getPrototypeOf(EditAndGoAgainCtrl.prototype), 'constructor', this).call(this);

    this.item = props.item;
  }

  _inherits(EditAndGoAgainCtrl, _Controller);

  _createClass(EditAndGoAgainCtrl, [{
    key: 'load',
    value: function load() {
      this.template = $(new _view2['default']().render());
    }
  }, {
    key: 'find',
    value: function find() {
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

      var form = new _libUtilForm2['default'](this.template);

      form.send(this.save.bind(this));
    }
  }, {
    key: 'save',
    value: function save() {
      var _this = this;

      _libUtilNav2['default'].hide(this.template, this.domain.intercept(function () {
        _libUtilNav2['default'].hide(_this.template.closest('.edit-and-go-again'), _this.domain.intercept(function () {

          var newItem = _this.toItem();

          _this.publish('create item', newItem).subscribe(function (pubsub, item) {
            console.warn('NEW ITEM', item);
            pubsub.unsubscribe();
          });

          // app.socket.emit('create item', new_item);

          // app.socket.once('could not create item', function (error) {
          //   console.error(error)
          // });

          // app.socket.once('created item', function (item) {
          //   console.log('created item', item);

          //     if ( new_item.upload ) {
          //       item.upload = new_item.upload;
          //     }

          //     if ( new_item.youtube ) {
          //       item.youtube = new_item.youtube;
          //     }

          //     var item  = new (require('../../../components/item/ctrl'))(item);

          //     item.load(app.domain.intercept(function () {
          //       item.template.insertBefore(edit.item.template);

          //       item.render(app.domain.intercept(function () {
          //         item.find('toggle promote').click();
          //       }));
          //     }));
          // });
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

// function Component_EditAndGoAgain_Controller () {

//   'use strict';

//   var Nav       =   require('../../lib/util/nav');
//   var Creator   =   require('../../components/creator//ctrl');
//   var Item      =   require('../../components/item/ctrl');
//   var Form      =   require('../../lib/util/form');

//   /**
//    *  @class
//    *
//    *  @arg {String} type
//    *  @arg {String?} parent
//    */

//   function Edit (item) {

//     console.log('EDIT', item)

//     if ( ! app ) {
//       throw new Error('Missing app');
//     }

//     var self = this;

//     app.domain.run(function () {
//       if ( ! item || ( ! item instanceof require('../../components/item/ctrl') ) ) {
//         throw new Error('Item must be an Item');
//       }

//       self.item = item;
//     });
//   }

//   Edit.prototype.get = function (cb) {
//     var edit = this;

//     $.ajax({
//       url: '/partial/creator'
//     })

//       .error(cb)

//       .success(function (data) {
//         edit.template = $(data);

//         cb(null, edit.template);
//       });

//     return this;
//   };

//   Edit.prototype.find = function (name) {
//     switch ( name ) {
//       case 'create button':
//         return this.template.find('.button-create:first');

//       case 'dropbox':
//         return this.template.find('.drop-box');

//       case 'subject':
//         return this.template.find('[name="subject"]');

//       case 'description':
//         return this.template.find('[name="description"]');

//       case 'item media':
//         return this.template.find('.item-media');

//       case 'reference':
//         return this.template.find('.reference');

//       case 'reference board':
//         return this.template.find('.reference-board');
//     }
//   };

//   Edit.prototype.render = function (cb) {

//     var edit = this;

//     // this.template.find('textarea').autogrow();

//     this.template.find('[name="subject"]').val(edit.item.item.subject);
//     this.template.find('[name="description"]')
//       .val(edit.item.item.description)
//       .autogrow();

//     if ( edit.item.item.references.length ) {
//       this.template.find('[name="reference"]').val(edit.item.item.references[0].url);
//     }

//     this.template.find('.item-media')
//       .empty()
//       .append(edit.item.media());

//     var form = new Form(this.template);

//     form.send(edit.save);

//     return this;
//   };

//   Edit.prototype.save = require('../../components/edit-and-go-again/controllers/save');

//   Edit.prototype.toItem = function () {
//     var item = {
//       from:         this.item.item._id,
//       subject:      this.find('subject').val(),
//       description:  this.find('description').val(),
//       user:         app.socket.synuser,
//       type:         this.item.item.type
//     };

//     if ( this.find('item media').find('img').length ) {

//       if ( this.find('item media').find('.youtube-preview').length ) {
//         item.youtube = this.find('item media').find('.youtube-preview').data('video');
//       }

//       else {
//         item.upload = this.find('item media').find('img').attr('src');
//       }
//     }

//     return item;
//   };

//   module.exports = Edit;

// }
module.exports = exports['default'];