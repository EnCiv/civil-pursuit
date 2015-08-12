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

var _libAppComponent = require('../lib/app/component');

var _libAppComponent2 = _interopRequireDefault(_libAppComponent);

var _utilIcon = require('./util/icon');

var _utilIcon2 = _interopRequireDefault(_utilIcon);

var _utilAccordion = require('./util/accordion');

var _utilAccordion2 = _interopRequireDefault(_utilAccordion);

var _creator = require('./creator');

var _creator2 = _interopRequireDefault(_creator);

var Panel = (function (_React$Component) {
  function Panel() {
    _classCallCheck(this, Panel);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Panel, _React$Component);

  _createClass(Panel, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {}
  }, {
    key: 'render',
    value: function render() {
      var creator = undefined,
          creatorIcon = undefined;

      if (this.props.creator !== false) {
        creator = _react2['default'].createElement(
          _utilAccordion2['default'],
          null,
          _react2['default'].createElement(_creator2['default'], this.props)
        );
        creatorIcon = _react2['default'].createElement(_utilIcon2['default'], { icon: 'plus' });
      }

      return _react2['default'].createElement(
        'section',
        { className: _libAppComponent2['default'].classList(this, 'syn-panel') },
        _react2['default'].createElement(
          'section',
          { className: 'syn-panel-heading' },
          _react2['default'].createElement(
            'h4',
            null,
            this.props.title
          ),
          creatorIcon
        ),
        _react2['default'].createElement(
          'section',
          { className: 'syn-panel-body' },
          creator,
          this.props.children
        )
      );
    }
  }]);

  return Panel;
})(_react2['default'].Component);

exports['default'] = Panel;
module.exports = exports['default'];

// console.warn('panel', props);