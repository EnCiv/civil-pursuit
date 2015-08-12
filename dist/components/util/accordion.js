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
  function Accordion(props) {
    _classCallCheck(this, Accordion);

    _get(Object.getPrototypeOf(Accordion.prototype), 'constructor', this).call(this, props);
    this.state = { visibility: false };
  }

  _inherits(Accordion, _React$Component);

  _createClass(Accordion, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      var _this = this;

      if ('show' in props) {
        (function () {
          // this.setState({ visibility : props.show });

          var view = _react2['default'].findDOMNode(_this.refs.view);
          var content = _react2['default'].findDOMNode(_this.refs.content);

          if (props.show) {
            var height = content.offsetHeight;
            view.style.height = height + 'px';
            // content.style.marginTop = `-${height}px`;
            setTimeout(function () {
              content.style.position = 'relative';
              content.style.top = 0;
              // content.style.display = block;
              // content.style.marginTop = 0;
              // content.style.opacity = 1;
              // content.style.transform = 'rotateY(0deg)'
            }, 1000);
          } else {
            view.style.height = 0;
            content.style.position = 'absolute';
            content.style.top = '-9000px';
            // content.style.opacity = 0;
            // content.style.display = 'none';
          }
        })();
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