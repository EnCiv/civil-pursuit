'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

var _utilAccordion = require('./util/accordion');

var _utilAccordion2 = _interopRequireDefault(_utilAccordion);

var _utilIcon = require('./util/icon');

var _utilIcon2 = _interopRequireDefault(_utilIcon);

var _itemMedia = require('./item-media');

var _itemMedia2 = _interopRequireDefault(_itemMedia);

var _promote = require('./promote');

var _promote2 = _interopRequireDefault(_promote);

var _details = require('./details');

var _details2 = _interopRequireDefault(_details);

var _subtype = require('./subtype');

var _subtype2 = _interopRequireDefault(_subtype);

var _harmony = require('./harmony');

var _harmony2 = _interopRequireDefault(_harmony);

var _utilButtonGroup = require('./util/button-group');

var _utilButtonGroup2 = _interopRequireDefault(_utilButtonGroup);

var _join = require('./join');

var _join2 = _interopRequireDefault(_join);

var Item = (function (_React$Component) {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function Item(props) {
    _classCallCheck(this, Item);

    _get(Object.getPrototypeOf(Item.prototype), 'constructor', this).call(this, props);

    this.expanded = false;

    this.state = {
      showPromote: this.props['new'] ? 1 : 0,
      showDetails: 0,
      showSubtype: 0,
      showHarmony: 0,
      item: this.props.item
    };

    this.listeners();
  }

  _inherits(Item, _React$Component);

  _createClass(Item, [{
    key: 'listeners',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function listeners() {
      if (typeof window !== 'undefined') {
        if (this.state.item) {
          window.socket.on('item image uploaded ' + this.props.item._id, this.updateItem.bind(this));

          window.socket.on('item changed ' + this.props.item._id, this.updateItem.bind(this));
        }
      }
    }
  }, {
    key: 'updateItem',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function updateItem(item) {
      this.setState({ item: item });
    }
  }, {
    key: 'componentWillUnmount',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function componentWillUnmount() {
      window.socket.removeListener('item image uploaded ' + this.props.item._id, this.updateItem.bind(this));

      window.socket.removeListener('item changed ' + this.props.item._id, this.updateItem.bind(this));
    }
  }, {
    key: 'hideOthers',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function hideOthers(except) {
      var item = _react2['default'].findDOMNode(this.refs.item);

      var itemAccordions = item.querySelectorAll('.toggler:not(.' + except + ') .syn-accordion-wrapper.show');

      console.log('other accordions', itemAccordions.length, '.toggler:not(.' + except + ') .syn-accordion-wrapper.show', item.id);

      for (var i = 0; i < itemAccordions.length; i++) {
        console.log(itemAccordions[i]);
        itemAccordions[i].classList.remove('show');
      }

      var panel = item.closest('.syn-panel');

      var creator = panel.querySelector('.syn-panel-body > .syn-accordion .syn-accordion-wrapper.show');

      if (creator) {
        creator.classList.remove('show');
      }

      if (item.id) {
        var otherItems = panel.querySelectorAll('.item:not(#item-' + item.id + ') .toggler .syn-accordion-wrapper.show');

        for (var i = 0; i < otherItems.length; i++) {
          otherItems[i].classList.remove('show');
        }
      }
    }
  }, {
    key: 'togglePromote',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function togglePromote() {
      if (this.props.user) {
        this.hideOthers('promote');

        this.setState({ showPromote: this.state.showPromote + 1 });
      } else {
        _join2['default'].click();
      }
    }
  }, {
    key: 'toggleDetails',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function toggleDetails() {
      this.hideOthers('details');
      this.setState({ showDetails: this.state.showDetails + 1 });
    }
  }, {
    key: 'toggleSubtype',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function toggleSubtype() {
      this.hideOthers();
      this.setState({ showSubtype: this.state.showSubtype + 1 });
    }
  }, {
    key: 'toggleHarmony',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function toggleHarmony() {
      this.hideOthers();
      this.setState({ showHarmony: this.state.showHarmony + 1 });
    }
  }, {
    key: 'componentDidMount',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function componentDidMount() {
      var _this = this;

      var media = undefined;

      var image = _react2['default'].findDOMNode(this.refs.media).querySelector('img');

      var video = _react2['default'].findDOMNode(this.refs.media).querySelector('iframe');

      if (video) {
        media = _react2['default'].findDOMNode(this.refs.media).querySelector('.video-container');
      } else {
        media = image;
      }

      var item = _react2['default'].findDOMNode(this.refs.item);

      var more = _react2['default'].findDOMNode(this.refs.more);

      var truncatable = item.querySelector('.item-truncatable');
      var subject = item.querySelector('.item-subject');
      var description = item.querySelector('.item-description');
      var reference = item.querySelector('.item-reference a');
      var buttons = item.querySelector('.item-buttons');

      var onLoad = function onLoad() {
        var mediaHeight = media.offsetTop + media.offsetHeight - 40;

        console.log({ mediaHeight: mediaHeight, media: media, item: _this.props.item.subject });

        var limit = undefined;

        if (!buttons) {
          limit = mediaHeight;
        } else {
          var buttonsHeight = buttons.offsetTop + buttons.offsetHeight - 40;

          if (mediaHeight >= buttonsHeight) {
            limit = mediaHeight;
          } else {
            limit = buttonsHeight;
          }
        }

        Item.paint(subject, limit);
        Item.paint(reference, limit);
        Item.paint(description, limit);

        if (!item.querySelector('.word.hide')) {
          more.style.display = 'none';
        }

        if (_this.props['new']) {
          _this.setState({ showPromote: true });
        }
      };

      if (image) {
        image.addEventListener('load', onLoad);
      } else {
        video.addEventListener('load', onLoad);
      }
    }
  }, {
    key: 'readMore',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function readMore() {
      var truncatable = _react2['default'].findDOMNode(this.refs.item).querySelector('.item-truncatable');

      truncatable.classList.toggle('expand');

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
      var item = this.state.item;

      var buttons = undefined,
          referenceLink = undefined,
          referenceTitle = undefined,
          textSpan = 50,
          promote = undefined,
          details = undefined,
          subtype = undefined,
          harmony = undefined;

      if (this.props.buttons !== false) {
        buttons = _react2['default'].createElement(
          'section',
          { className: 'item-buttons' },
          _react2['default'].createElement(
            _utilButtonGroup2['default'],
            null,
            _react2['default'].createElement(
              _utilButton2['default'],
              { small: true, shy: true, onClick: this.togglePromote.bind(this) },
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
              { small: true, shy: true, onClick: this.toggleDetails.bind(this), className: 'toggle-details' },
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
              { small: true, shy: true, onClick: this.toggleSubtype.bind(this) },
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
              { small: true, shy: true, onClick: this.toggleHarmony.bind(this) },
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
      } else {
        textSpan = 75;
      }

      if (this.props.promote !== false) {
        promote = _react2['default'].createElement(
          'div',
          { className: 'toggler promote' },
          _react2['default'].createElement(
            _utilAccordion2['default'],
            _extends({ poa: this.refs.item, show: this.state.showPromote, name: 'promote' }, this.props),
            _react2['default'].createElement(_promote2['default'], { item: this.props.item, show: this.state.showPromote, ref: 'promote' })
          )
        );
      }

      if (this.props.details !== false) {
        details = _react2['default'].createElement(
          'div',
          { className: 'toggler details' },
          _react2['default'].createElement(
            _utilAccordion2['default'],
            _extends({ poa: this.refs.item, show: this.state.showDetails, name: 'details' }, this.props),
            _react2['default'].createElement(_details2['default'], { item: this.props.item, show: this.state.showDetails })
          )
        );
      }

      if (this.props.subtype !== false) {
        subtype = _react2['default'].createElement(
          'div',
          { className: 'toggler subtype' },
          _react2['default'].createElement(
            _utilAccordion2['default'],
            _extends({ show: this.state.showSubtype, name: 'subtype', poa: this.refs.item }, this.props),
            _react2['default'].createElement(_subtype2['default'], _extends({}, this.props, { item: this.props.item, show: this.state.showSubtype }))
          )
        );
      }

      if (this.props.harmony !== false) {
        harmony = _react2['default'].createElement(
          'div',
          { className: 'toggler harmony' },
          _react2['default'].createElement(
            _utilAccordion2['default'],
            _extends({ show: this.state.showHarmony, name: 'harmony' }, this.props, { poa: this.refs.item }),
            _react2['default'].createElement(_harmony2['default'], _extends({}, this.props, { item: this.props.item, show: this.state.showHarmony }))
          )
        );
      }

      if (item.references.length) {
        referenceLink = item.references[0].url;
        referenceTitle = item.references[0].title;
      }

      return _react2['default'].createElement(
        'article',
        { id: 'item-' + item._id, className: 'item', ref: 'item' },
        _react2['default'].createElement(_itemMedia2['default'], { item: item, ref: 'media' }),
        buttons,
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
              { className: 'item-read-more', ref: 'more' },
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
        _react2['default'].createElement('section', { style: { clear: 'both' } }),
        _react2['default'].createElement(
          'section',
          { style: { marginRight: '-10px' } },
          promote,
          details,
          subtype,
          harmony
        )
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
            span.classList.add('hide');
          }
        });
      });
    }
  }]);

  return Item;
})(_react2['default'].Component);

exports['default'] = Item;
module.exports = exports['default'];