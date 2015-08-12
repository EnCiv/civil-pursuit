'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _libAppComponent = require('../lib/app/component');

var _libAppComponent2 = _interopRequireDefault(_libAppComponent);

var _panel = require('./panel');

var _panel2 = _interopRequireDefault(_panel);

var _utilRow = require('./util/row');

var _utilRow2 = _interopRequireDefault(_utilRow);

var _utilColumn = require('./util/column');

var _utilColumn2 = _interopRequireDefault(_utilColumn);

var _identity = require('./identity');

var _identity2 = _interopRequireDefault(_identity);

var _residence = require('./residence');

var _residence2 = _interopRequireDefault(_residence);

var _utilIcon = require('./util/icon');

var _utilIcon2 = _interopRequireDefault(_utilIcon);

var Profile = (function (_React$Component) {
  function Profile(props) {
    _classCallCheck(this, Profile);

    _get(Object.getPrototypeOf(Profile.prototype), 'constructor', this).call(this, props);

    this.state = { user: null, ready: false, config: null, countries: [], states: [] };

    this.get();
  }

  _inherits(Profile, _React$Component);

  _createClass(Profile, [{
    key: 'get',
    value: function get() {
      var _this = this;

      if (typeof window !== 'undefined') {
        Promise.all([new Promise(function (ok, ko) {
          window.socket.emit('get user info').on('OK get user info', ok);
        }), new Promise(function (ok, ko) {
          window.socket.emit('get countries').on('OK get countries', ok);
        }), new Promise(function (ok, ko) {
          window.socket.emit('get config').on('OK get config', ok);
        }), new Promise(function (ok, ko) {
          window.socket.emit('get states').on('OK get states', ok);
        })]).then(function (results) {
          var _results = _slicedToArray(results, 4);

          var user = _results[0];
          var countries = _results[1];
          var config = _results[2];
          var states = _results[3];

          _this.setState({ ready: true, user: user, countries: countries, config: config, states: states });
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {

      var content = _react2['default'].createElement(
        'div',
        { className: _libAppComponent2['default'].classList(this, 'text-center', 'gutter', 'muted') },
        _react2['default'].createElement(_utilIcon2['default'], { icon: 'circle-o-notch', spin: true, size: 4 })
      );

      if (this.state.ready) {
        content = _react2['default'].createElement(
          _utilRow2['default'],
          null,
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '50' },
            _react2['default'].createElement(_identity2['default'], { user: this.state.user, countries: this.state.countries, config: this.state.config })
          ),
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '50' },
            _react2['default'].createElement(_residence2['default'], { user: this.state.user, states: this.state.states })
          )
        );
      }

      return _react2['default'].createElement(
        _panel2['default'],
        { title: 'Profile', creator: false },
        _react2['default'].createElement('hr', null),
        _react2['default'].createElement(
          'h4',
          { className: 'gutter muted' },
          'Providing Profile information is optional. We know that it requires a lot of trust to provide it. We will use this information to provide you with a better experience by working to maintain diverse participation.'
        ),
        _react2['default'].createElement('hr', null),
        content
      );
    }
  }]);

  return Profile;
})(_react2['default'].Component);

exports['default'] = Profile;
module.exports = exports['default'];