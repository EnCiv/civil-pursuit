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

var _utilRow = require('./util/row');

var _utilRow2 = _interopRequireDefault(_utilRow);

var _utilColumn = require('./util/column');

var _utilColumn2 = _interopRequireDefault(_utilColumn);

var _utilImage = require('./util/image');

var _utilImage2 = _interopRequireDefault(_utilImage);

var _utilIcon = require('./util/icon');

var _utilIcon2 = _interopRequireDefault(_utilIcon);

var _utilButton = require('./util/button');

var _utilButton2 = _interopRequireDefault(_utilButton);

var _utilInputGroup = require('./util/input-group');

var _utilInputGroup2 = _interopRequireDefault(_utilInputGroup);

var _utilTextInput = require('./util/text-input');

var _utilTextInput2 = _interopRequireDefault(_utilTextInput);

var _utilSelect = require('./util/select');

var _utilSelect2 = _interopRequireDefault(_utilSelect);

var Residence = (function (_React$Component) {
  function Residence(props) {
    _classCallCheck(this, Residence);

    _get(Object.getPrototypeOf(Residence.prototype), 'constructor', this).call(this, props);

    this.state = { user: this.props.user };
  }

  _inherits(Residence, _React$Component);

  _createClass(Residence, [{
    key: 'validateGPS',
    value: function validateGPS() {
      var _this = this;

      navigator.geolocation.watchPosition(function (position) {
        var _position$coords = position.coords;
        var longitude = _position$coords.longitude;
        var latitude = _position$coords.latitude;

        window.socket.emit('validate gps', longitude, latitude).on('OK validate gps', function (user) {
          return _this.setState({ user: user });
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var gps = undefined;

      if (!this.state.user['gps validated']) {
        gps = _react2['default'].createElement(
          _utilRow2['default'],
          { className: 'gutter' },
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '50' },
            _react2['default'].createElement(_utilIcon2['default'], { icon: 'exclamation-circle' }),
            ' Not yet validated!'
          ),
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '50' },
            _react2['default'].createElement(
              _utilButton2['default'],
              { onClick: this.validateGPS.bind(this) },
              'Validate GPS'
            )
          )
        );
      } else {
        gps = _react2['default'].createElement(
          _utilRow2['default'],
          { className: 'gutter' },
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '50' },
            _react2['default'].createElement(_utilIcon2['default'], { icon: 'check' }),
            ' GPS validated!'
          ),
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '50' },
            'GPS validated ',
            this.state.user['gps validated']
          )
        );
      }

      var states = this.props.states.map(function (state) {
        return _react2['default'].createElement(
          'option',
          { value: state._id },
          state.name
        );
      });

      return _react2['default'].createElement(
        'section',
        null,
        _react2['default'].createElement(
          'section',
          { style: { width: '50%', float: 'left' } },
          _react2['default'].createElement(_utilImage2['default'], { src: 'http://res.cloudinary.com/hscbexf6a/image/upload/v1423262161/gvmv05rqke71uqsh3qzq.png', responsive: true })
        ),
        _react2['default'].createElement(
          'section',
          { className: 'gutter' },
          _react2['default'].createElement(
            'h2',
            null,
            'Residence'
          ),
          _react2['default'].createElement(
            'p',
            null,
            'This information allows us to place you into the district, state, county, and city communities in which you belong. By using GPS validate - it provides a way to prevent people from impersonating a local resident.'
          )
        ),
        gps,
        _react2['default'].createElement(
          _utilInputGroup2['default'],
          { block: true, className: 'gutter' },
          _react2['default'].createElement(_utilTextInput2['default'], { placeholder: 'City' }),
          _react2['default'].createElement(
            _utilSelect2['default'],
            { style: { flexBasis: '30%' } },
            states
          )
        ),
        _react2['default'].createElement(
          _utilInputGroup2['default'],
          { block: true, className: 'gutter' },
          _react2['default'].createElement(_utilTextInput2['default'], { placeholder: 'Zip' }),
          _react2['default'].createElement(_utilTextInput2['default'], { placeholder: 'Zip +4' })
        )
      );
    }
  }]);

  return Residence;
})(_react2['default'].Component);

exports['default'] = Residence;
module.exports = exports['default'];