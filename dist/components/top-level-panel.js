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

var _panel = require('./panel');

var _panel2 = _interopRequireDefault(_panel);

var _item = require('./item');

var _item2 = _interopRequireDefault(_item);

var _utilLoading = require('./util/loading');

var _utilLoading2 = _interopRequireDefault(_utilLoading);

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
    value: function getType() {}
  }, {
    key: 'getItems',
    value: function getItems(type) {}
  }, {
    key: 'render',
    value: function render() {

      // let { type } = this.state;
      //
      // let panelTitle;
      //
      // if ( type ) {
      //   panelTitle = type.name;
      // }
      //
      // panelTitle = this.props.topLevelType.name;
      //
      // let items = this.state.items.map(item => (
      //   <Item key={ item._id } item={ item } { ...this.props } />
      // ));

      var items = _react2['default'].createElement(_utilLoading2['default'], null);

      var title = 'Loading items';

      var type = null;

      if (this.props.topLevelType) {
        type = this.props.topLevelType;
        title = type.name;
      }

      return _react2['default'].createElement(
        _panel2['default'],
        _extends({ title: title, type: type }, this.props),
        items
      );
    }
  }]);

  return TopLevelPanel;
})(_react2['default'].Component);

exports['default'] = TopLevelPanel;
module.exports = exports['default'];

// if ( typeof window !== 'undefined' ) {
//   window.socket.emit('get top level type')
//     .on('OK get top level type', type => this.getItems(type));
// }

// window.socket.emit('get items', { type })
//   .on('OK get items', (panel, items) => {
//     let relevant = false;
//     if ( panel.type._id === type._id ) {
//
//       relevant = true;
//
//       if ( panel.parent ) {
//         relevant = panel.parent === panel.parent;
//       }
//
//       if ( relevant ) {
//         this.setState({ type, items });
//       }
//     }
//   })