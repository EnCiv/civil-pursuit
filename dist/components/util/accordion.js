'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

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
    this.counter = 0;
    this.height = null;
    this.visibility = false;
    this.id = null;

    this.state = { attr: 'hide' };
  }

  _inherits(Accordion, _React$Component);

  _createClass(Accordion, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      var props = arguments[0] === undefined ? {} : arguments[0];

      if (props.active === true) {
        this.setState({ attr: 'show' });
      } else if (props.active === false) {
        this.setState({ attr: 'hide' });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'section',
        { className: 'syn-accordion', ref: 'view' },
        _react2['default'].createElement(
          'section',
          { className: 'syn-accordion-wrapper ' + this.state.attr, ref: 'wrapper' },
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