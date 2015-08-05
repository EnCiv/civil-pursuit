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

var _publicJson = require('../../../public.json');

var _publicJson2 = _interopRequireDefault(_publicJson);

var IdentityView = (function (_Element) {
  function IdentityView(props, extra) {
    _classCallCheck(this, IdentityView);

    _get(Object.getPrototypeOf(IdentityView.prototype), 'constructor', this).call(this, '#identity.section.center');

    this.add(new _cincoDist.Elements(this.header(), this.body(), this.toggle()));
  }

  _inherits(IdentityView, _Element);

  _createClass(IdentityView, [{
    key: 'header',
    value: function header() {
      return new _cincoDist.Element('.gutter').add(new _cincoDist.Element('.tablet-40.user-image-container').add(new _cincoDist.Element('img.img-responsive.user-image.radius', {
        src: _publicJson2['default']['user image']
      })), new _cincoDist.Element('h2.profile-section-title').text('Identity'), new _cincoDist.Element('.tablet-push-40.gutter').add(new _cincoDist.Element('.pre-text').text(_publicJson2['default'].profile.identity.description)));
    }
  }, {
    key: 'body',
    value: function body() {
      return new _cincoDist.Element('.identity-collapse.is-container.row').add(new _cincoDist.Element('.is-section').add(new _cincoDist.Element('.row.gutter').add(this.avatar(), this.civility(), this.citizenship(), this.dob(), this.gender())));
    }
  }, {
    key: 'avatar',
    value: function avatar() {
      return new _cincoDist.Element('p.image-buttons.row').add(new _cincoDist.Element('button.block.upload-image').text('Upload Image'), new _cincoDist.Element('input.upload-identity-picture.hide', {
        type: 'file'
      }));
    }
  }, {
    key: 'civility',
    value: function civility() {
      return new _cincoDist.Element('.names.input-group-tablet.gutter-right.gutter-bottom').add(new _cincoDist.Element('input.watch-100.tablet-40', {
        type: 'text',
        placeholder: 'First name',
        name: 'first-name'
      }), new _cincoDist.Element('input.watch-100.tablet-20', {
        type: 'text',
        placeholder: 'Middle name',
        name: 'middle-name'
      }), new _cincoDist.Element('input.watch-100.tablet-40', {
        type: 'text',
        placeholder: 'Last name',
        name: 'last-name'
      }));
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      return new _cincoDist.Element('.row.toggle-arrow.gutter.text-center').add(new _cincoDist.Element('i.fa.fa-arrow-down.cursor-pointer'));
    }
  }, {
    key: 'citizenship',
    value: function citizenship() {
      return new _cincoDist.Elements(new _cincoDist.Element('.row.gutter-top').add(new _cincoDist.Element('button.very.shy.tablet-30').text('Citizenship'), new _cincoDist.Element('.tablet-70').add(new _cincoDist.Element('select.citizenship.block.gutter').add(new _cincoDist.Element('option', { value: '' }).text('Choose one')))), new _cincoDist.Element('.row').add(new _cincoDist.Element('button.very.shy.tablet-30').text('Dual citizenship'), new _cincoDist.Element('.tablet-70').add(new _cincoDist.Element('select.citizenship.block.gutter').add(new _cincoDist.Element('option', { value: '' }).text('None')))));
    }
  }, {
    key: 'dob',
    value: function dob() {
      return new _cincoDist.Element('.row').add(new _cincoDist.Element('button.very.shy.tablet-30').text('Birthdate'), new _cincoDist.Element('.tablet-70').add(new _cincoDist.Element('input.block.gutter.dob', { type: 'date' })));
    }
  }, {
    key: 'gender',
    value: function gender() {
      return new _cincoDist.Element('.row').add(new _cincoDist.Element('button.very.shy.tablet-30').text('Gender'), new _cincoDist.Element('.tablet-70').add(new _cincoDist.Element('select.gender.block.gutter').add(new _cincoDist.Element('option', { value: 'M' }).text('Male'), new _cincoDist.Element('option', { value: 'F' }).text('Female'), new _cincoDist.Element('option', { value: 'O' }).text('Other'))));
    }
  }]);

  return IdentityView;
})(_cincoDist.Element);

exports['default'] = IdentityView;
module.exports = exports['default'];