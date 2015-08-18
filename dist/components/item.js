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

    this.truncated = false;

    if (typeof window !== 'undefined' && this.props.item) {

      var _parent = this.props.item.lineage[0];

      if (_parent) {
        _parent = _parent._id;
      }

      this.panelId = makePanelId({ type: this.props.item.type, parent: _parent });
    }

    this.state = {
      active: null,
      item: this.props.item,
      ping: 0
    };

    // this.listeners();
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

    value: function componentWillUnmount() {}
  }, {
    key: 'toggle',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function toggle(toggler) {
      if (toggler === 'promote' && !this.props.user) {
        _join2['default'].click();

        return;
      }

      if (this.props.item) {
        window.Dispatcher.emit('set active', this.panelId, '' + this.props.item._id + '-' + toggler);
      }
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

      if (!this.truncated) {
        (function () {
          var more = _react2['default'].findDOMNode(_this.refs.more);

          var truncatable = item.querySelector('.item-truncatable');
          var subject = item.querySelector('.item-subject');
          var description = item.querySelector('.item-description');
          var reference = item.querySelector('.item-reference a');
          var buttons = item.querySelector('.item-buttons');

          var onLoad = function onLoad() {
            var mediaHeight = media.offsetTop + media.offsetHeight - 40;

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

          _this.truncated = true;
        })();
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
      var item = this.props.item;

      var buttons = undefined,
          referenceLink = undefined,
          referenceTitle = undefined,
          textSpan = 50,
          promote = undefined,
          details = undefined,
          subtype = undefined,
          harmony = undefined;

      if (this.props.buttons !== false) {

        var subtypeGroup = undefined,
            harmonyGroup = undefined;

        if (this.props.item.subtype) {
          subtypeGroup = _react2['default'].createElement(
            _utilButton2['default'],
            { small: true, shy: true, onClick: this.toggle.bind(this, 'subtype') },
            _react2['default'].createElement(
              'span',
              null,
              item.children,
              ' '
            ),
            _react2['default'].createElement(_utilIcon2['default'], { icon: 'fire' })
          );
        }

        if (this.props.item.type.harmony.length) {
          harmonyGroup = _react2['default'].createElement(
            _utilButton2['default'],
            { small: true, shy: true, onClick: this.toggle.bind(this, 'harmony') },
            _react2['default'].createElement(
              'span',
              null,
              item.harmony,
              ' '
            ),
            _react2['default'].createElement(_utilIcon2['default'], { icon: 'music' })
          );
        }

        var childrenGroup = _react2['default'].createElement(
          _utilButtonGroup2['default'],
          null,
          subtypeGroup,
          harmonyGroup
        );

        buttons = _react2['default'].createElement(
          'section',
          { className: 'item-buttons' },
          _react2['default'].createElement(
            _utilButtonGroup2['default'],
            null,
            _react2['default'].createElement(
              _utilButton2['default'],
              { small: true, shy: true, onClick: this.toggle.bind(this, 'promote') },
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
              { small: true, shy: true, onClick: this.toggle.bind(this, 'details'), className: 'toggle-details' },
              _react2['default'].createElement(
                'span',
                null,
                item.popularity.number + '%',
                ' '
              ),
              _react2['default'].createElement(_utilIcon2['default'], { icon: 'signal' })
            )
          ),
          childrenGroup
        );
      } else {
        textSpan = 75;
      }

      if (this.props.promote !== false && this.panelId) {
        var promoteIsActive = this.props.panels[this.panelId].active === '' + this.props.item._id + '-promote';

        promote = _react2['default'].createElement(
          'div',
          { className: 'toggler promote' },
          _react2['default'].createElement(
            _utilAccordion2['default'],
            _extends({}, this.props, {
              poa: this.refs.item,
              active: promoteIsActive,
              name: 'promote'
            }),
            _react2['default'].createElement(_promote2['default'], _extends({
              item: this.props.item
            }, this.props, {
              active: promoteIsActive,
              ref: 'promote',
              'panel-id': this.panelId
            }))
          )
        );
      }

      if (this.props.details !== false && this.panelId) {
        var detailsIsActive = this.props.panels[this.panelId].active === '' + this.props.item._id + '-details';

        details = _react2['default'].createElement(
          'div',
          { className: 'toggler details' },
          _react2['default'].createElement(
            _utilAccordion2['default'],
            _extends({}, this.props, {
              poa: this.refs.item,
              active: detailsIsActive,
              name: 'details'
            }),
            _react2['default'].createElement(_details2['default'], _extends({
              item: this.props.item
            }, this.props, {
              active: detailsIsActive,
              ref: 'details' }))
          )
        );
      }

      if (this.props.subtype !== false && this.panelId && this.props.item.subtype) {
        var subtypeIsActive = this.props.panels[this.panelId].active === '' + this.props.item._id + '-subtype';

        subtype = _react2['default'].createElement(
          'div',
          { className: 'toggler subtype' },
          _react2['default'].createElement(
            _utilAccordion2['default'],
            _extends({}, this.props, {
              poa: this.refs.item,
              active: subtypeIsActive,
              name: 'subtype'
            }),
            _react2['default'].createElement(_subtype2['default'], _extends({
              item: this.props.item
            }, this.props, {
              active: subtypeIsActive,
              ref: 'subtype' }))
          )
        );
      }

      if (this.props.harmony !== false) {
        var harmonyIsActive = this.props.panels[this.panelId].active === '' + this.props.item._id + '-harmony';

        harmony = _react2['default'].createElement(
          'div',
          { className: 'toggler harmony' },
          _react2['default'].createElement(
            _utilAccordion2['default'],
            _extends({}, this.props, {
              active: harmonyIsActive,
              name: 'harmony',
              poa: this.refs.item }),
            _react2['default'].createElement(_harmony2['default'], _extends({}, this.props, {
              item: this.props.item,
              active: harmonyIsActive }))
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

// window.socket.removeListener(`item image uploaded ${this.props.item._id}`, this.updateItem.bind(this));
//
// window.socket.removeListener(`item changed ${this.props.item._id}`, this.updateItem.bind(this));