'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utilLoading = require('./util/loading');

var _utilLoading2 = _interopRequireDefault(_utilLoading);

var _votes = require('./votes');

var _votes2 = _interopRequireDefault(_votes);

var Popularity = (function (_React$Component) {
  function Popularity() {
    _classCallCheck(this, Popularity);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Popularity, _React$Component);

  _createClass(Popularity, [{
    key: 'animate',
    value: function animate() {
      var number = this.props.number;

      var bar = _react2['default'].findDOMNode(this.refs.bar);
      bar.style.width = '' + number + '%';
    }
  }, {
    key: 'render',
    value: function render() {
      var number = this.props.number;

      setTimeout(this.animate.bind(this), 1000);

      return _react2['default'].createElement(
        'div',
        { className: 'syn-popularity' },
        _react2['default'].createElement(
          'div',
          { className: 'syn-popularity-bar', style: { width: 0 }, ref: 'bar' },
          '' + number + '%'
        )
      );
    }
  }]);

  return Popularity;
})(_react2['default'].Component);

var Feedback = (function (_React$Component2) {
  function Feedback() {
    _classCallCheck(this, Feedback);

    if (_React$Component2 != null) {
      _React$Component2.apply(this, arguments);
    }
  }

  _inherits(Feedback, _React$Component2);

  _createClass(Feedback, [{
    key: 'render',
    value: function render() {
      var entries = this.props.entries;

      console.log({ entries: entries });

      if (!entries.length) {
        return _react2['default'].createElement('div', null);
      }

      var comments = entries.map(function (entry) {
        return _react2['default'].createElement(
          'div',
          { key: entry._id },
          entry.feedback
        );
      });

      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          'h4',
          null,
          entries.length,
          ' feedback'
        ),
        comments
      );
    }
  }]);

  return Feedback;
})(_react2['default'].Component);

var Details = (function (_React$Component3) {
  function Details(props) {
    _classCallCheck(this, Details);

    _get(Object.getPrototypeOf(Details.prototype), 'constructor', this).call(this, props);

    this.status = 'iddle';

    this.state = {};
  }

  _inherits(Details, _React$Component3);

  _createClass(Details, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      if (this.status === 'iddle' && props.active) {
        this.status = 'ready';
        window.Dispatcher.emit('get details', this.props.item);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var content = _react2['default'].createElement(_utilLoading2['default'], { message: 'Loading details' });

      if (this.props.items[this.props.item._id] && this.props.items[this.props.item._id].details) {
        var details = this.props.items[this.props.item._id].details;

        content = [];

        content.push(_react2['default'].createElement(Popularity, this.props.item.popularity), _react2['default'].createElement(_votes2['default'], details), _react2['default'].createElement(Feedback, { entries: details.feedback }));
      }

      return _react2['default'].createElement(
        'section',
        { className: 'item-details ' + this.props.className },
        content
      );
    }
  }]);

  return Details;
})(_react2['default'].Component);

exports['default'] = Details;
module.exports = exports['default'];