'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoDist = require('cinco/dist');

var _configJson = require('../../../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _identityView = require('../identity/view');

var _identityView2 = _interopRequireDefault(_identityView);

var _panelView = require('../panel/view');

var _panelView2 = _interopRequireDefault(_panelView);

var ProfileView = (function (_Element) {
  function ProfileView(props, extra) {
    _classCallCheck(this, ProfileView);

    _get(Object.getPrototypeOf(ProfileView.prototype), 'constructor', this).call(this, '#profile.center');

    var panel = new _panelView2['default']({ creator: false });

    panel.find('.items').get(0).add(new _cincoDist.Element('.gutter').add(new _cincoDist.Element('.row.gutter-bottom').add(new _cincoDist.Element('.tablet-50').add(new _identityView2['default']()))));

    this.add(panel);
  }

  _inherits(ProfileView, _Element);

  return ProfileView;
})(_cincoDist.Element);

exports['default'] = ProfileView;
module.exports = exports['default'];