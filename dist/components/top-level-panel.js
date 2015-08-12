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

var _panel = require('./panel');

var _panel2 = _interopRequireDefault(_panel);

var _item = require('./item');

var _item2 = _interopRequireDefault(_item);

var TopLevelPanel = (function (_React$Component) {
  function TopLevelPanel(props) {
    _classCallCheck(this, TopLevelPanel);

    _get(Object.getPrototypeOf(TopLevelPanel.prototype), 'constructor', this).call(this, props);

    this.state = {
      type: null,
      items: []
    };

    this.get();
  }

  _inherits(TopLevelPanel, _React$Component);

  _createClass(TopLevelPanel, [{
    key: 'get',
    value: function get() {
      this.getType();
    }
  }, {
    key: 'getType',
    value: function getType() {
      var _this = this;

      if (typeof window !== 'undefined') {
        window.socket.emit('get top level type').on('OK get top level type', function (type) {
          return _this.getItems(type);
        });
      }
    }
  }, {
    key: 'getItems',
    value: function getItems(type) {
      var _this2 = this;

      window.socket.emit('get items', { type: type }).on('OK get items', function (panel, items) {
        console.log(panel, items);
        _this2.setState({ type: type, items: items });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var type = this.state.type;

      var panelTitle = undefined;

      if (type) {
        panelTitle = type.name;
      }

      var items = this.state.items.map(function (item) {
        return _react2['default'].createElement(_item2['default'], { item: item });
      });

      return _react2['default'].createElement(
        _panel2['default'],
        { title: panelTitle, type: type },
        items
      );
    }
  }]);

  return TopLevelPanel;
})(_react2['default'].Component);

exports['default'] = TopLevelPanel;
module.exports = exports['default'];