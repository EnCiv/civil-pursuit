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
    this.counter = 0;
    this.height = null;
    this.visibility = false;
    this.id = null;
  }

  _inherits(Accordion, _React$Component);

  _createClass(Accordion, [{
    key: 'componentWillMount',

    // Set id

    value: function componentWillMount() {}
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {

      if (props.show > this.counter) {
        this.counter = props.show;

        var content = _react2['default'].findDOMNode(this.refs.content);
        var wrapper = _react2['default'].findDOMNode(this.refs.wrapper);

        if (this.props.poa) {
          var poa = _react2['default'].findDOMNode(this.props.poa);
          window.scrollTo(0, poa.offsetTop - 60);
        }

        wrapper.classList.toggle('show');
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
          { className: 'syn-accordion-wrapper', ref: 'wrapper' },
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

// if ( typeof window !== 'undefined' ) {
//   if ( ! this.id ) {
//     if ( ! window.accordion_id ) {
//       window.accordion_id = 0;
//     }
//     this.id = window.accordion_id ++;
//   }
//   console.log('accordion id', accordion_id);
// }

// let view = React.findDOMNode(this.refs.view);
// let content = React.findDOMNode(this.refs.content);
// let wrapper = React.findDOMNode(this.refs.wrapper);
//
// if ( ! view.id ) {
//   view.id = `accordion-${this.id}`;
// }
//
// if ( ! this.height ) {
//   let content = React.findDOMNode(this.refs.content);
//   let wrapper = React.findDOMNode(this.refs.wrapper);
//   let view = React.findDOMNode(this.refs.view);
//
//   // this.height = content.offsetTop + 99999 + view.offsetTop;
//
//   this.height = 1000;
//
//   console.log('accordion height', this.props.name, { view: {
//     offsetTop: view.offsetTop
//   }, wrapper : {
//     offsetTop : wrapper.offsetTop
//   }, content: {
//     offsetTop : content.offsetTop,
//     height: content.offsetHeight
//   }});
//
//   let stylesheet = document.querySelector('[rel="stylesheet"][name="stylesheet"]');
//   let sheet = stylesheet.sheet;
//   let rules = sheet.cssRules;
//   sheet.insertRule(`#accordion-${this.id}.syn-accordion-wrapper { margin-top: -${this.height}px }`, rules.length);
// }