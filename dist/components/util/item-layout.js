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

var ItemLayout = (function (_React$Component) {
  function ItemLayout() {
    _classCallCheck(this, ItemLayout);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(ItemLayout, _React$Component);

  _createClass(ItemLayout, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'article',
        { id: this.props.id, className: 'item', ref: 'item' },
        _react2['default'].createElement(ItemMedia, { item: item, ref: 'media' }),
        _react2['default'].createElement(
          'section',
          { className: 'item-text' },
          _react2['default'].createElement(
            'div',
            { className: 'item-truncatable' },
            _react2['default'].createElement(
              'h4',
              { className: 'item-subject' },
              this.props.subject
            ),
            _react2['default'].createElement(
              'h5',
              { className: 'item-reference' },
              _react2['default'].createElement(
                'a',
                { href: this.props.referenceLink, target: '_blank', rel: 'nofollow' },
                this.props.referenceTitle
              )
            ),
            _react2['default'].createElement(
              'div',
              { className: 'item-description pre-text' },
              this.props.description
            ),
            _react2['default'].createElement(
              'div',
              { className: 'item-read-more' },
              _react2['default'].createElement(
                'a',
                { href: '#', onClick: this.readMore.bind(this) },
                'Read ',
                _react2['default'].createElement(
                  'span',
                  { ref: 'readMoreText' },
                  'more'
                )
              )
            )
          )
        ),
        buttons,
        _react2['default'].createElement('section', { style: { clear: 'both' } })
      );
    }
  }]);

  return ItemLayout;
})(_react2['default'].Component);

exports['default'] = ItemLayout;
module.exports = exports['default'];