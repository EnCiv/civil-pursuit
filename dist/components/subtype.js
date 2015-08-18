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

var _panelItems = require('./panel-items');

var _panelItems2 = _interopRequireDefault(_panelItems);

var Subtype = (function (_React$Component) {
  function Subtype(props) {
    _classCallCheck(this, Subtype);

    _get(Object.getPrototypeOf(Subtype.prototype), 'constructor', this).call(this, props);

    this.status = 'iddle';

    this.id = makePanelId({ type: this.props.item.subtype, parent: this.props.item._id });
  }

  _inherits(Subtype, _React$Component);

  _createClass(Subtype, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      if (this.status === 'iddle' && props.active) {
        this.status = 'ready';

        if (!props.panels[this.id]) {
          window.Dispatcher.emit('get items', { type: props.item.subtype, parent: props.item._id });
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var content = _react2['default'].createElement(_utilLoading2['default'], { message: 'Loading related' });

      if (this.props.panels[this.id] && this.status === 'ready') {
        content = _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(_panelItems2['default'], _extends({}, this.props, { panel: this.props.panels[this.id] }))
        );
      }

      return _react2['default'].createElement(
        'section',
        { className: 'item-subtype gutter-top ' + this.props.className },
        content
      );
    }
  }]);

  return Subtype;
})(_react2['default'].Component);

exports['default'] = Subtype;
module.exports = exports['default'];