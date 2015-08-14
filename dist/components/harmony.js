'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

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

var _panel = require('./panel');

var _panel2 = _interopRequireDefault(_panel);

var Harmony = (function (_React$Component) {
  function Harmony(props) {
    _classCallCheck(this, Harmony);

    _get(Object.getPrototypeOf(Harmony.prototype), 'constructor', this).call(this, props);

    this.status = 'iddle';

    this.state = { left: null, right: null, irrelevant: false, loaded: false };
  }

  _inherits(Harmony, _React$Component);

  _createClass(Harmony, [{
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
        (function () {
          var harmony = _this.props.item.type.harmony;

          if (!harmony.length) {
            _this.setState({ irrelevant: true });
          } else {
            Promise.all([new Promise(function (ok, ko) {
              window.socket.emit('get items', { type: harmony[0]._id, parent: _this.props.item._id }).on('OK get items', function (panel, items) {
                if (panel.type === harmony[0]._id) {
                  ok({ panel: panel, items: items });
                }
              });
            }), new Promise(function (ok, ko) {
              window.socket.emit('get items', { type: harmony[1]._id, parent: _this.props.item._id }).on('OK get items', function (panel, items) {
                if (panel.type === harmony[1]._id) {
                  ok({ panel: panel, items: items });
                }
              });
            })]).then(function (results) {
              var _results = _slicedToArray(results, 2);

              var left = _results[0];
              var right = _results[1];

              _this.setState({ left: left, right: right, loaded: true });
            });
          }
        })();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var content = _react2['default'].createElement(_utilLoading2['default'], null);

      var _state = this.state;
      var irrelevant = _state.irrelevant;
      var left = _state.left;
      var right = _state.right;
      var loaded = _state.loaded;
      var type = this.props.item.type;

      if (loaded) {
        if (irrelevant) {
          content = _react2['default'].createElement('hr', null);
        } else if (left || right) {
          var panels = [];

          if (left) {
            panels.push(_react2['default'].createElement(
              _panel2['default'],
              _extends({}, left.panel, { title: type.harmony[0].name }),
              left.items
            ));
          }

          if (right) {
            panels.push(_react2['default'].createElement(
              _panel2['default'],
              _extends({}, right.panel, { title: type.harmony[1].name }),
              right.items
            ));
          }

          content = _react2['default'].createElement(
            _utilRow2['default'],
            null,
            _react2['default'].createElement(
              _utilColumn2['default'],
              { span: '50' },
              panels[0]
            ),
            _react2['default'].createElement(
              _utilColumn2['default'],
              { span: '50' },
              panels[1]
            )
          );
        } else {
          content = _react2['default'].createElement(
            'div',
            null,
            '...'
          );
        }
      }

      return _react2['default'].createElement(
        'section',
        { className: 'subtype text-center' },
        content
      );
    }
  }]);

  return Harmony;
})(_react2['default'].Component);

exports['default'] = Harmony;
module.exports = exports['default'];