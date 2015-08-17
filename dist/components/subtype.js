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

var _utilLoading = require('./util/loading');

var _utilLoading2 = _interopRequireDefault(_utilLoading);

var _panel = require('./panel');

var _panel2 = _interopRequireDefault(_panel);

var Subtype = (function (_React$Component) {
  function Subtype(props) {
    _classCallCheck(this, Subtype);

    _get(Object.getPrototypeOf(Subtype.prototype), 'constructor', this).call(this, props);

    this.status = 'iddle';

    this.state = { panel: null, items: null };
  }

  _inherits(Subtype, _React$Component);

  _createClass(Subtype, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      if (props.show && this.status === 'iddle') {
        this.status = 'ready';
        this.get();
      }
    }
  }, {
    key: 'get',
    value: function get() {
      var _this = this;

      if (typeof window !== 'undefined') {
        window.socket.emit('get items', { type: this.props.item.subtype._id, parent: this.props.item._id }).on('OK get items', function (panel, items) {
          if (panel.type === _this.props.item.subtype._id) {
            _this.setState({ panel: panel, items: items });
          }
        });
      }
    }
  }, {
    key: 'toggleCreator',
    value: function toggleCreator(e) {
      e.preventDefault();

      var panel = _react2['default'].findDOMNode(this.refs.panel);
      var toggle = panel.querySelector('.toggle-creator');

      toggle.click();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var content = _react2['default'].createElement(_utilLoading2['default'], null);

      if (this.state.panel) {
        var items = [];

        if (this.state.items.length) {
          items = this.state.items.map(function (item) {
            return _react2['default'].createElement(Item, _extends({ key: item._id, item: item }, _this2.props));
          });
        } else {
          items = _react2['default'].createElement(
            'h5',
            null,
            _react2['default'].createElement(
              'a',
              { href: '#', onClick: this.toggleCreator.bind(this) },
              'Click the + to be the first to add something here'
            )
          );
        }

        content = [_react2['default'].createElement(
          _panel2['default'],
          _extends({}, this.props, this.state.panel, { title: this.props.item.subtype.name, ref: 'panel' }),
          items
        )];
      }

      return _react2['default'].createElement(
        'section',
        { className: 'item-subtype ' + this.props.className },
        content
      );
    }
  }]);

  return Subtype;
})(_react2['default'].Component);

exports['default'] = Subtype;
module.exports = exports['default'];