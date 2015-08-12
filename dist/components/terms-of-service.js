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

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var TermsOfService = (function (_React$Component) {
  function TermsOfService(props) {
    _classCallCheck(this, TermsOfService);

    _get(Object.getPrototypeOf(TermsOfService.prototype), 'constructor', this).call(this, props);

    this.state = { text: '<h1>Terms of service</h1>' };

    this.get();
  }

  _inherits(TermsOfService, _React$Component);

  _createClass(TermsOfService, [{
    key: 'get',
    value: function get() {
      var _this = this;

      if (typeof window !== 'undefined') {
        _superagent2['default'].get('/doc/terms-of-service.md').end(function (error, res) {
          console.log(error, res);
          if (res.status === 200) {
            _this.setState({ text: (0, _marked2['default'])(res.text) });
          }
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement('section', { dangerouslySetInnerHTML: { __html: this.state.text } });
    }
  }]);

  return TermsOfService;
})(_react2['default'].Component);

exports['default'] = TermsOfService;
module.exports = exports['default'];