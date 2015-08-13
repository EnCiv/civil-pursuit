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

var Accordion = (function (_React$Component) {
  // C(losed) O(pen) B(usy)

  function Accordion(props) {
    _classCallCheck(this, Accordion);

    _get(Object.getPrototypeOf(Accordion.prototype), 'constructor', this).call(this, props);
    this.status = 'CLOSED';
    this.counter = 0;
  }

  _inherits(Accordion, _React$Component);

  _createClass(Accordion, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      console.info('-- update accordion --', { name: props.name, status: this.status, request: props.show, counter: this.counter, close: props.close });

      if (props.close && this.status === 'OPENED') {
        console.warn('Closing upon request');
        return this.hide();
      }

      if (props.show > this.counter) {
        this.counter = props.show;

        switch (this.status) {
          case 'CLOSED':
            this.status = 'OPENING';
            window.Dispatcher.emit('open request');
            this.show();
            break;
          case 'OPENED':
            this.status = 'CLOSING';
            this.hide();
            break;
        }
      }
    }
  }, {
    key: 'show',
    value: function show() {
      var _this = this;

      var view = _react2['default'].findDOMNode(this.refs.view);
      var content = _react2['default'].findDOMNode(this.refs.content);

      view.style.display = 'block';

      setTimeout(function () {
        return _this.status = 'OPENED';
      }, 500);
    }
  }, {
    key: 'hide',
    value: function hide() {
      var view = _react2['default'].findDOMNode(this.refs.view);
      var content = _react2['default'].findDOMNode(this.refs.content);

      view.style.display = 'none';

      this.status = 'CLOSED';
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'section',
        { className: 'syn-accordion', ref: 'view' },
        _react2['default'].createElement(
          'section',
          null,
          _react2['default'].createElement(
            'section',
            { className: 'syn-accordion-content', ref: 'content' },
            this.props.children
          )
        )
      );
    }
  }]);

  return Accordion;
})(_react2['default'].Component);

exports['default'] = Accordion;
module.exports = exports['default'];