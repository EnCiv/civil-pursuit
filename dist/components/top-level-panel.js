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

var _item = require('./item');

var _item2 = _interopRequireDefault(_item);

var _utilLoading = require('./util/loading');

var _utilLoading2 = _interopRequireDefault(_utilLoading);

var TopLevelPanel = (function (_React$Component) {
  function TopLevelPanel() {
    _classCallCheck(this, TopLevelPanel);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(TopLevelPanel, _React$Component);

  _createClass(TopLevelPanel, [{
    key: 'loadMore',
    value: function loadMore(e) {
      e.preventDefault();

      window.Dispatcher.emit('get more items', this.props.topLevelType._id);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var items = _react2['default'].createElement(_utilLoading2['default'], null);

      var loadMore = _react2['default'].createElement('div', { className: 'gutter-top' });

      var title = 'Loading items';

      var type = null;

      var loaded = false;

      if (this.props.topLevelType) {
        type = this.props.topLevelType;
        title = type.name;

        loaded = true;

        if (this.props.panels[type._id]) {
          items = this.props.panels[type._id].items.map(function (item) {
            return _react2['default'].createElement(_item2['default'], _extends({ item: item, key: item._id }, _this.props));
          });

          var _props$panels$type$_id = this.props.panels[type._id];
          var skip = _props$panels$type$_id.skip;
          var limit = _props$panels$type$_id.limit;
          var count = _props$panels$type$_id.count;

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
        _extends({ title: title, type: type }, this.props, { loaded: loaded }),
        items,
        loadMore
      );
    }
  }]);

  return TopLevelPanel;
})(_react2['default'].Component);

exports['default'] = TopLevelPanel;
module.exports = exports['default'];