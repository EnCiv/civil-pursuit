'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoDist = require('cinco/dist');

var _synComponentsItemView = require('syn/components/item/view');

var _synComponentsItemView2 = _interopRequireDefault(_synComponentsItemView);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//  Creator
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var Creator = (function (_Element) {
  function Creator(props, extra) {
    _classCallCheck(this, Creator);

    _get(Object.getPrototypeOf(Creator.prototype), 'constructor', this).call(this, 'form.creator.is-container', {
      name: 'create',
      novalidate: 'novalidate',
      role: 'form',
      method: 'POST'
    });

    this.props = props;

    this.extra = extra || {};

    var itemBox = this.itemBox();

    itemBox.find('.item-text').get(0).empty().add(this.inputs());

    this.add(new _cincoDist.Element('.is-section').add(itemBox));
  }

  _inherits(Creator, _Element);

  _createClass(Creator, [{
    key: 'modern',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Drag and drop (modern browsers only)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function modern() {
      return new _cincoDist.Element('.modern').add(new _cincoDist.Element('h4').text('Drop image here'), new _cincoDist.Element('p').text('or'));
    }
  }, {
    key: 'legacy',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Legacy input type file (masked by a button for design purposes)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function legacy() {
      return new _cincoDist.Element('.phasing').add(new _cincoDist.Element('button.upload-image-button', { type: 'button' }).text('Choose a file'), new _cincoDist.Element('input', {
        name: 'image',
        type: 'file',
        value: 'Upload image' }).close());
    }
  }, {
    key: 'dropBox',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Image uploader container
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function dropBox() {
      return new _cincoDist.Element('.drop-box').add(this.modern(), this.legacy());
    }
  }, {
    key: 'submitButton',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Submit button
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function submitButton() {
      return new _cincoDist.Element('button.button-create.shy.medium').add(new _cincoDist.Element('i.fa.fa-bullhorn'));
    }
  }, {
    key: 'itemBox',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Item Component
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function itemBox() {
      return new _synComponentsItemView2['default']({
        item: {
          media: this.dropBox(),
          buttons: new _cincoDist.Elements(this.submitButton()),
          collapsers: false
        }
      });
    }
  }, {
    key: 'inputs',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Text inputs
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function inputs() {
      return new _cincoDist.Element('.item-inputs').add(this.subject(), this.description(), this.reference());
    }
  }, {
    key: 'subject',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Subject field
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function subject() {
      return new _cincoDist.Element('input', {
        type: 'text',
        placeholder: 'Item subject',
        required: 'required',
        name: 'subject' });
    }
  }, {
    key: 'description',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Description field
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function description() {
      return new _cincoDist.Element('textarea', {
        placeholder: 'Item description',
        required: 'required',
        name: 'description'
      });
    }
  }, {
    key: 'reference',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  URL
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function reference() {
      return new _cincoDist.Elements(new _cincoDist.Element('input.reference', {
        type: 'url',
        placeholder: 'http://',
        name: 'reference'
      }), new _cincoDist.Element('.reference-board.hide').text('Looking up'));
    }
  }]);

  return Creator;
})(_cincoDist.Element);

exports['default'] = Creator;
module.exports = exports['default'];