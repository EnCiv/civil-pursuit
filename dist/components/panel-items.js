'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _panel = require('./panel');

var _panel2 = _interopRequireDefault(_panel);

var _utilLoading = require('./util/loading');

var _utilLoading2 = _interopRequireDefault(_utilLoading);

var _item = require('./item');

var _item2 = _interopRequireDefault(_item);

var PanelItems = (function (_React$Component) {
  function PanelItems() {
    _classCallCheck(this, PanelItems);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(PanelItems, _React$Component);

  _createClass(PanelItems, [{
    key: 'loadMore',
    value: function loadMore(e) {
      e.preventDefault();

      window.Dispatcher.emit('get more items', this.props.panel.panel);
    }
  }, {
    key: 'toggleCreator',
    value: function toggleCreator(e) {
      e.preventDefault();

      window.Dispatcher.emit('set active', this.props.panel.panel, 'creator');
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var title = 'Loading items';

      var type = null;

      var loaded = false;

      var content = _react2['default'].createElement(_utilLoading2['default'], null);

      var loadMore = _react2['default'].createElement('div', { className: 'gutter-top' });

      var parent = null;

      var className = '';

      if (this.props.panel) {
        var panel = this.props.panel;

        type = panel.panel.type;

        className = 'syn-panel-' + type;

        parent = panel.panel.parent;

        if (parent) {
          className += '-' + (parent._id || parent);
        }

        title = panel.panel.type.name;

        loaded = true;

        if (!panel.items.length) {
          content = _react2['default'].createElement(
            'div',
            { className: 'gutter text-center' },
            _react2['default'].createElement(
              'a',
              { href: '#', onClick: this.toggleCreator.bind(this) },
              'Click the + to be the first to add something here'
            )
          );
        } else {
          content = [];

          panel.items.forEach(function (item) {
            return content.push(_react2['default'].createElement(_item2['default'], _extends({ key: item._id }, _this.props, { item: item })));
          });

          var count = panel.count;
          var _panel$panel = panel.panel;
          var skip = _panel$panel.skip;
          var limit = _panel$panel.limit;

          var end = skip + limit;

          if (count > limit) {
            loadMore = _react2['default'].createElement(
              'h5',
              { className: 'gutter text-center' },
              _react2['default'].createElement(
                'a',
                { href: '#', onClick: this.loadMore.bind(this) },
                'Show more'
              )
            );
          }
        }
      }

      return _react2['default'].createElement(
        _panel2['default'],
        _extends({}, this.props, { title: title, type: type, parent: parent, loaded: loaded, className: className }),
        content,
        loadMore
      );
    }
  }]);

  return PanelItems;
})(_react2['default'].Component);

exports['default'] = PanelItems;
module.exports = exports['default'];