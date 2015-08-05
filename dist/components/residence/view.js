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

var ResidenceView = (function (_Element) {
  function ResidenceView(props) {
    _classCallCheck(this, ResidenceView);

    _get(Object.getPrototypeOf(ResidenceView.prototype), 'constructor', this).call(this, '#residence.section');

    this.add(new _cincoDist.Elements(this.header(), this.body(), this.toggle()));
  }

  _inherits(ResidenceView, _Element);

  _createClass(ResidenceView, [{
    key: 'header',
    value: function header() {
      return new _cincoDist.Element('.gutter').add(new _cincoDist.Element('.tablet-40.user-image-container').add(new _cincoDist.Element('img.img-responsive.user-image.radius', {
        src: _publicJson2['default'].profile.residence.image
      })), new _cincoDist.Element('h2.profile-section-title').text('Residence'), new _cincoDist.Element('.tablet-push-40.gutter').add(new _cincoDist.Element('.pre-text').text(_publicJson2['default'].profile.residence.description)));
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      return new _cincoDist.Element('.row.toggle-arrow.gutter.text-center').add(new _cincoDist.Element('i.fa.fa-arrow-down.cursor-pointer'));
    }
  }, {
    key: 'body',
    value: function body() {
      return new _cincoDist.Element('.residence-collapse.is-container').add(new _cincoDist.Element('.is-section').add(new _cincoDist.Element('.row.gutter-bottom').add(new _cincoDist.Element('.tablet-50').add(new _cincoDist.Element('span.not-yet-validated').add(new _cincoDist.Element('i.fa.fa-exclamation-circle'), new _cincoDist.Element('span').text(' Not yet validated!')), new _cincoDist.Element('span.hide.pre.is-validated').add(new _cincoDist.Element('i.fa.fa-check'), new _cincoDist.Element('span').text(' Validated'), new _cincoDist.Element('span.validated-moment'))), new _cincoDist.Element('.tablet-50').add(new _cincoDist.Element('button.btn.btn-block.validate-gps', { disabled: true }).text('GPS - Validate'))), new _cincoDist.Element('.row').add(new _cincoDist.Element('input.tablet-40.gutter.city', {
        type: 'text',
        placeholder: 'City'
      }), new _cincoDist.Element('select.tablet-30.gutter.state').add(new _cincoDist.Element('option', { value: '' }).text('State')), new _cincoDist.Element('input.tablet-15.gutter.zip', {
        type: 'text',
        placeholder: 'ZIP'
      }), new _cincoDist.Element('input.tablet-15.gutter.zip4', {
        type: 'text',
        placeholder: 'ZIP +4'
      }))));
    }
  }]);

  return ResidenceView;
})(_cincoDist.Element);

exports['default'] = ResidenceView;
module.exports = exports['default'];