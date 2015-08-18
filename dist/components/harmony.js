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

var _utilRow = require('./util/row');

var _utilRow2 = _interopRequireDefault(_utilRow);

var _utilColumn = require('./util/column');

var _utilColumn2 = _interopRequireDefault(_utilColumn);

var _panelItems = require('./panel-items');

var _panelItems2 = _interopRequireDefault(_panelItems);

var Harmony = (function (_React$Component) {
  function Harmony(props) {
    _classCallCheck(this, Harmony);

    _get(Object.getPrototypeOf(Harmony.prototype), 'constructor', this).call(this, props);

    this.status = 'iddle';

    var type = this.props.item.type;
    var harmony = type.harmony;

    this.leftId = null;
    this.rightId = null;

    if (harmony.length) {
      this.leftId = makePanelId({ type: harmony[0], parent: this.props.item._id });

      this.rightId = makePanelId({ type: harmony[1], parent: this.props.item._id });
    }
  }

  _inherits(Harmony, _React$Component);

  _createClass(Harmony, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      if (this.status === 'iddle' && props.active) {
        this.status = 'ready';

        if (!props.panels[this.leftId]) {
          window.Dispatcher.emit('get items', {
            type: props.item.type.harmony[0],
            parent: props.item._id
          });
        }

        if (!props.panels[this.rightId]) {
          window.Dispatcher.emit('get items', {
            type: props.item.type.harmony[1],
            parent: props.item._id
          });
        }
      }
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render() {
      var contentLeft = _react2['default'].createElement(_utilLoading2['default'], { message: 'Loading' });

      var contentRight = _react2['default'].createElement(_utilLoading2['default'], { message: 'Loading' });

      if (this.props.panels[this.leftId] && this.status === 'ready') {
        contentLeft = _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(_panelItems2['default'], _extends({}, this.props, { panel: this.props.panels[this.leftId] }))
        );
      }

      if (this.props.panels[this.rightId] && this.status === 'ready') {
        contentRight = _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(_panelItems2['default'], _extends({}, this.props, { panel: this.props.panels[this.rightId] }))
        );
      }

      return _react2['default'].createElement(
        'section',
        { className: 'item-harmony ' + this.props.className },
        _react2['default'].createElement(
          _utilRow2['default'],
          { 'data-stack': 'phone-and-down' },
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '50' },
            contentLeft
          ),
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '50' },
            contentRight
          )
        )
      );
    }
  }]);

  return Harmony;
})(_react2['default'].Component);

exports['default'] = Harmony;
module.exports = exports['default'];