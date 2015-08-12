'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utilRow = require('./util/row');

var _utilRow2 = _interopRequireDefault(_utilRow);

var _utilColumn = require('./util/column');

var _utilColumn2 = _interopRequireDefault(_utilColumn);

var _utilButton = require('./util/button');

var _utilButton2 = _interopRequireDefault(_utilButton);

var _utilIcon = require('./util/icon');

var _utilIcon2 = _interopRequireDefault(_utilIcon);

var _itemMedia = require('./item-media');

var _itemMedia2 = _interopRequireDefault(_itemMedia);

var _itemButtons = require('./item-buttons');

var _itemButtons2 = _interopRequireDefault(_itemButtons);

var Item = (function (_React$Component) {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function Item(props) {
    _classCallCheck(this, Item);

    _get(Object.getPrototypeOf(Item.prototype), 'constructor', this).call(this, props);

    this.expanded = false;
  }

  _inherits(Item, _React$Component);

  _createClass(Item, [{
    key: 'componentDidMount',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function componentDidMount() {
      var media = _react2['default'].findDOMNode(this.refs.media).querySelector('img, iframe');

      var item = _react2['default'].findDOMNode(this.refs.item);

      var more = item.querySelector('.more');

      var truncatable = item.querySelector('.item-truncatable');
      var subject = item.querySelector('.item-subject');
      var description = item.querySelector('.item-description');
      var reference = item.querySelector('.item-reference a');

      media.addEventListener('load', function () {
        if (!more) {
          var limit = media.offsetTop + media.offsetHeight - 40;

          Item.paint(subject, limit);
          Item.paint(reference, limit);
          Item.paint(description, limit);
        }
      });
    }
  }, {
    key: 'readMore',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function readMore() {
      var truncatable = _react2['default'].findDOMNode(this.refs.item).querySelector('.item-truncatable');

      truncatable.classList.toggle('--expand');

      this.expanded = !this.expanded;

      var text = _react2['default'].findDOMNode(this.refs.readMoreText);

      if (this.expanded) {
        text.innerText = 'less';
      } else {
        text.innerText = 'more';
      }
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render() {
      var item = this.props.item;

      var buttons = undefined,
          referenceLink = undefined,
          referenceTitle = undefined,
          textSpan = 50;

      if (this.props.buttons !== false) {
        buttons = _react2['default'].createElement(
          _utilColumn2['default'],
          { span: '25' },
          _react2['default'].createElement(_itemButtons2['default'], { item: item })
        );
      } else {
        textSpan = 75;
      }

      if (item.references.length) {
        referenceLink = item.references[0].url;
        referenceTitle = item.references[0].title;
      }

      return _react2['default'].createElement(
        'article',
        { id: 'item-' + item._id, className: 'item', ref: 'item' },
        _react2['default'].createElement(_itemMedia2['default'], { item: item, ref: 'media' }),
        _react2['default'].createElement(
          'section',
          { className: 'item-text' },
          _react2['default'].createElement(
            'div',
            { className: 'item-truncatable' },
            _react2['default'].createElement(
              'h4',
              { className: 'item-subject' },
              item.subject
            ),
            _react2['default'].createElement(
              'h5',
              { className: 'item-reference' },
              _react2['default'].createElement(
                'a',
                { href: referenceLink, target: '_blank', rel: 'nofollow' },
                referenceTitle
              )
            ),
            _react2['default'].createElement(
              'div',
              { className: 'item-description pre-text' },
              item.description
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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }], [{
    key: 'spanify',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function spanify(text) {
      var lines = [];

      text.split(/\n/).forEach(function (line) {
        lines.push(line.split(/\s+/));
      });

      lines = lines.map(function (line) {
        if (line.length === 1 && !line[0]) {
          return [];
        }
        return line;
      });

      console.log({ lines: lines });

      return lines;
    }
  }, {
    key: 'paint',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function paint(container, limit) {
      var lines = Item.spanify(container.textContent);
      container.innerHTML = '';

      var whiteSpace = function whiteSpace() {
        var span = document.createElement('span');
        span.appendChild(document.createTextNode(' '));
        return span;
      };

      lines.forEach(function (line) {
        var div = document.createElement('div');
        container.appendChild(div);
        line.forEach(function (word) {
          var span = document.createElement('span');
          span.appendChild(document.createTextNode(word));
          span.classList.add('word');
          div.appendChild(span);
          div.appendChild(whiteSpace());
          var offset = span.offsetTop;

          if (offset > limit) {
            span.classList.add('--hide');
          }
        });
      });
    }
  }]);

  return Item;
})(_react2['default'].Component);

exports['default'] = Item;
module.exports = exports['default'];