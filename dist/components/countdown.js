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

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _panel = require('./panel');

var _panel2 = _interopRequireDefault(_panel);

var _utilButton = require('./util/button');

var _utilButton2 = _interopRequireDefault(_utilButton);

var Countdown = (function (_React$Component) {
  function Countdown() {
    _classCallCheck(this, Countdown);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Countdown, _React$Component);

  _createClass(Countdown, [{
    key: 'componentDidMount',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function componentDidMount() {
      var _this = this;

      var remainingSeconds = _react2['default'].findDOMNode(this.refs.remainingSeconds);
      var remainingMinutes = _react2['default'].findDOMNode(this.refs.remainingMinutes);
      var remainingHours = _react2['default'].findDOMNode(this.refs.remainingHours);
      var remainingDays = _react2['default'].findDOMNode(this.refs.remainingDays);

      this.timer = setInterval(function () {
        var remainingTime = _this.countRemainingTime();

        if (remainingTime.days) {
          remainingDays.querySelector('span').innerText = remainingTime.days;
        }

        if (remainingTime.hours) {
          remainingHours.querySelector('span').innerText = remainingTime.hours;
        }

        if (remainingTime.minutes) {
          remainingMinutes.querySelector('span').innerText = remainingTime.minutes;
        }

        remainingSeconds.innerText = remainingTime.seconds;
      }, 1000);
    }
  }, {
    key: 'countRemainingTime',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function countRemainingTime() {
      var now = Date.now();

      var interval = new Date(this.props.discussion.deadline) - now;

      var days = Math.floor(interval / (1000 * 60 * 60 * 24));

      var daysRemainder = interval % (1000 * 60 * 60 * 24);

      var hours = Math.floor(daysRemainder / (1000 * 60 * 60));

      var hoursRemainder = daysRemainder % (1000 * 60 * 60);

      var minutes = Math.floor(hoursRemainder / (1000 * 60));

      var minutesRemainder = hoursRemainder % (1000 * 60);

      var seconds = Math.floor(minutesRemainder / 1000);

      return { interval: interval, days: days, hours: hours, minutes: minutes, seconds: seconds };
    }
  }, {
    key: 'inlineEmail',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function inlineEmail() {
      var discussion = this.props.discussion;

      return 'mailto:?Subject=' + encodeURIComponent(discussion.subject) + '&Body=' + encodeURIComponent(discussion.description.replace(/\{hostname\}/g, location.hostname));
    }
  }, {
    key: 'register',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function register() {
      document.querySelector('.syn-top_bar-join_button button').click();
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render() {
      var now = (0, _moment2['default'])();
      var discussion = this.props.discussion;
      var user = this.props.user;
      var deadline = discussion.deadline;

      console.log({ discussion: discussion, user: user });

      deadline = (0, _moment2['default'])(new Date(deadline));

      var month = deadline.format('MMM');
      var day = deadline.format('D');
      var year = deadline.format('YYYY');
      var hour = deadline.format('h');
      var minute = deadline.format('mm');
      var meridian = deadline.format('a');

      var button = _react2['default'].createElement(
        _utilButton2['default'],
        { block: true, primary: true, medium: true, onClick: this.register.bind(this) },
        'Register'
      );

      if (user && discussion.registered.some(function (id) {
        return id === user.id;
      })) {
        button = _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            'h4',
            { className: 'success' },
            'Thank you for registering!'
          ),
          _react2['default'].createElement(
            'h4',
            null,
            'Invite the diverse people you know'
          ),
          _react2['default'].createElement(
            'a',
            { href: this.inlineEmail(), target: '_blank', className: 'button primary', style: { width: '30%' } },
            'Email'
          )
        );
      }

      var openings = discussion.goal - discussion.registered.length;

      return _react2['default'].createElement(
        _panel2['default'],
        { title: 'Countdown', className: 'text-center' },
        _react2['default'].createElement(
          'h2',
          null,
          'Countdown to discussion'
        ),
        _react2['default'].createElement(
          'h1',
          null,
          month,
          '. ',
          day,
          ', ',
          year,
          ', ',
          hour,
          ':',
          minute,
          ' ',
          meridian
        ),
        _react2['default'].createElement(
          'h2',
          null,
          _react2['default'].createElement(
            'span',
            { ref: 'remainingDays' },
            _react2['default'].createElement(
              'span',
              null,
              '0'
            ),
            'd '
          ),
          _react2['default'].createElement(
            'span',
            { ref: 'remainingHours' },
            _react2['default'].createElement(
              'span',
              null,
              '00'
            ),
            ':'
          ),
          _react2['default'].createElement(
            'span',
            { ref: 'remainingMinutes' },
            _react2['default'].createElement(
              'span',
              null,
              '00'
            ),
            ':'
          ),
          _react2['default'].createElement(
            'span',
            { ref: 'remainingSeconds' },
            _react2['default'].createElement(
              'span',
              null,
              '00'
            )
          )
        ),
        _react2['default'].createElement(
          'h3',
          null,
          'Openings remaining'
        ),
        _react2['default'].createElement(
          'h2',
          null,
          openings
        ),
        button
      );
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }]);

  return Countdown;
})(_react2['default'].Component);

exports['default'] = Countdown;
module.exports = exports['default'];