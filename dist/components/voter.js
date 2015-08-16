'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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

var Voter = (function (_React$Component) {
  function Voter() {
    _classCallCheck(this, Voter);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Voter, _React$Component);

  _createClass(Voter, [{
    key: 'setRegisteredVoter',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function setRegisteredVoter() {
      var registered = _react2['default'].findDOMNode(this.refs.registered).value;

      if (registered) {
        window.socket.emit('set registered voter', registered);
      }
    }
  }, {
    key: 'setParty',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function setParty() {
      var party = _react2['default'].findDOMNode(this.refs.party).value;

      if (party) {
        window.socket.emit('set party', party);
      }
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render() {
      var _props = this.props;
      var user = _props.user;
      var config = _props.config;

      var parties = config.party.map(function (party) {
        return _react2['default'].createElement(
          'option',
          { value: party._id, key: party._id },
          party.name
        );
      });

      return _react2['default'].createElement(
        'section',
        null,
        _react2['default'].createElement(
          'section',
          { style: { width: '50%', float: 'left' } },
          _react2['default'].createElement(_utilImage2['default'], { src: 'http://res.cloudinary.com/hscbexf6a/image/upload/v1423262642/p61hdtkkdks8rednknqo.png', responsive: true })
        ),
        _react2['default'].createElement(
          'section',
          { className: 'gutter' },
          _react2['default'].createElement(
            'h2',
            null,
            'Voter'
          ),
          _react2['default'].createElement(
            'p',
            null,
            'We use this information to make sure that we have balanced participation. When we see too little participation in certain categories then we increase our efforts to get more participation there.'
          )
        ),
        _react2['default'].createElement(
          _utilRow2['default'],
          { baseline: true, className: 'gutter' },
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '25' },
            'Registered voter'
          ),
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '75' },
            _react2['default'].createElement(
              _utilSelect2['default'],
              { block: true, medium: true, ref: 'registered', defaultValue: user.registered_voter, onChange: this.setRegisteredVoter.bind(this) },
              _react2['default'].createElement(
                'option',
                { value: '' },
                'Choose one'
              ),
              _react2['default'].createElement(
                'option',
                { value: true },
                'Yes'
              ),
              _react2['default'].createElement(
                'option',
                { value: false },
                'No'
              )
            )
          )
        ),
        _react2['default'].createElement(
          _utilRow2['default'],
          { baseline: true, className: 'gutter' },
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '25' },
            'Political Party'
          ),
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '75' },
            _react2['default'].createElement(
              _utilSelect2['default'],
              { block: true, medium: true, ref: 'party', defaultValue: user.party, onChange: this.setParty.bind(this) },
              _react2['default'].createElement(
                'option',
                { value: '' },
                'Choose one'
              ),
              parties
            )
          )
        )
      );
    }
  }]);

  return Voter;
})(_react2['default'].Component);

exports['default'] = Voter;
module.exports = exports['default'];