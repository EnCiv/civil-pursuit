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

var _libAppComponent = require('../lib/app/component');

var _libAppComponent2 = _interopRequireDefault(_libAppComponent);

var Slider = (function (_React$Component) {
  function Slider() {
    _classCallCheck(this, Slider);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Slider, _React$Component);

  _createClass(Slider, [{
    key: 'toggleDescription',
    value: function toggleDescription(e) {
      var description = _react2['default'].findDOMNode(this.refs.description);
      description.classList.toggle('syn-visible');
    }
  }, {
    key: 'render',
    value: function render() {
      var criteria = this.props.criteria;

      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          _utilRow2['default'],
          null,
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '40' },
            _react2['default'].createElement(
              'h5',
              { onClick: this.toggleDescription.bind(this) },
              criteria.name
            ),
            _react2['default'].createElement(
              'h5',
              { className: 'syn-sliders-criteria-description', ref: 'description' },
              criteria.description
            )
          ),
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '60' },
            _react2['default'].createElement('input', { type: 'range' })
          )
        )
      );
    }
  }]);

  return Slider;
})(_react2['default'].Component);

var Sliders = (function (_React$Component2) {
  function Sliders() {
    _classCallCheck(this, Sliders);

    if (_React$Component2 != null) {
      _React$Component2.apply(this, arguments);
    }
  }

  _inherits(Sliders, _React$Component2);

  _createClass(Sliders, [{
    key: 'render',
    value: function render() {
      var criterias = this.props.criterias;

      var sliders = criterias.map(function (criteria) {
        return _react2['default'].createElement(Slider, { criteria: criteria });
      });

      return _react2['default'].createElement(
        'div',
        { className: _libAppComponent2['default'].classList(this) },
        sliders
      );
    }
  }]);

  return Sliders;
})(_react2['default'].Component);

exports['default'] = Sliders;
module.exports = exports['default'];