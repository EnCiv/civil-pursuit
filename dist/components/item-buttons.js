'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utilButton = require('./util/button');

var _utilButton2 = _interopRequireDefault(_utilButton);

var _utilButtonGroup = require('./util/button-group');

var _utilButtonGroup2 = _interopRequireDefault(_utilButtonGroup);

var _utilIcon = require('./util/icon');

var _utilIcon2 = _interopRequireDefault(_utilIcon);

var ItemButtons = (function (_React$Component) {
  function ItemButtons() {
    _classCallCheck(this, ItemButtons);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(ItemButtons, _React$Component);

  _createClass(ItemButtons, [{
    key: 'render',
    value: function render() {
      var item = this.props.item;

      console.log({ item: item });

      return _react2['default'].createElement(
        'section',
        { className: 'item-buttons' },
        _react2['default'].createElement(
          _utilButtonGroup2['default'],
          null,
          _react2['default'].createElement(
            _utilButton2['default'],
            { small: true, shy: true, onClick: this.toggleCreator.bind(this) },
            _react2['default'].createElement(
              'span',
              null,
              item.promotions,
              ' '
            ),
            _react2['default'].createElement(_utilIcon2['default'], { icon: 'bullhorn' })
          )
        ),
        _react2['default'].createElement(
          _utilButtonGroup2['default'],
          null,
          _react2['default'].createElement(
            _utilButton2['default'],
            { small: true, shy: true },
            _react2['default'].createElement(
              'span',
              null,
              item.popularity.number + '%',
              ' '
            ),
            _react2['default'].createElement(_utilIcon2['default'], { icon: 'signal' })
          )
        ),
        _react2['default'].createElement(
          _utilButtonGroup2['default'],
          null,
          _react2['default'].createElement(
            _utilButton2['default'],
            { small: true, shy: true },
            _react2['default'].createElement(
              'span',
              null,
              item.promotions,
              ' '
            ),
            _react2['default'].createElement(_utilIcon2['default'], { icon: 'fire' })
          ),
          _react2['default'].createElement(
            _utilButton2['default'],
            { small: true, shy: true },
            _react2['default'].createElement(
              'span',
              null,
              item.popularity.number + '%',
              ' '
            ),
            _react2['default'].createElement(_utilIcon2['default'], { icon: 'music' })
          )
        )
      );
    }
  }]);

  return ItemButtons;
})(_react2['default'].Component);

exports['default'] = ItemButtons;
module.exports = exports['default'];