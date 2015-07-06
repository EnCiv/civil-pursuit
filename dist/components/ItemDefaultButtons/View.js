'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoEs5 = require('cinco/es5');

var ItemDefaultButtons = (function (_Elements) {
  function ItemDefaultButtons(props) {
    _classCallCheck(this, ItemDefaultButtons);

    _get(Object.getPrototypeOf(ItemDefaultButtons.prototype), 'constructor', this).call(this);

    var loginButton = new _cincoEs5.Element('button.item-toggle-promote.shy');

    loginButton.add(new _cincoEs5.Element('span.promoted').text('0'), new _cincoEs5.Element('i.fa.fa-bullhorn'));

    var joinButton = new _cincoEs5.Element('button.item-toggle-details.shy');

    joinButton.add(new _cincoEs5.Element('span.promoted-percent').text('0%'), new _cincoEs5.Element('i.fa.fa-signal'));

    var related = new _cincoEs5.Element('div').add(new _cincoEs5.Element('span.related'));

    this.add(loginButton, new _cincoEs5.Element('div'), joinButton, related);
  }

  _inherits(ItemDefaultButtons, _Elements);

  return ItemDefaultButtons;
})(_cincoEs5.Elements);

exports['default'] = ItemDefaultButtons;
module.exports = exports['default'];