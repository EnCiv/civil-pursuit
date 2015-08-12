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

var _libAppComponent = require('../../lib/app/component');

var _libAppComponent2 = _interopRequireDefault(_libAppComponent);

var Modal = (function (_React$Component) {
  function Modal() {
    _classCallCheck(this, Modal);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Modal, _React$Component);

  _createClass(Modal, [{
    key: 'hide',
    value: function hide(e) {

      e.preventDefault();

      var modal = _react2['default'].findDOMNode(this.refs.modal);

      modal.classList.remove('syn--visible');
    }
  }, {
    key: 'render',
    value: function render() {

      // return (
      //   <Base classes={ classes } { ...this.props }>
      //     <div className="syn-modal-flipper">
      //       <Base classes={ ["syn-modal-front"] }>

      //       </Base>
      //     </div>
      //   </Base>
      // );

      return _react2['default'].createElement(
        'section',
        { className: _libAppComponent2['default'].classList(this, 'syn-modal'), ref: 'modal' },
        _react2['default'].createElement('div', { className: 'syn-modal-cover', onClick: this.hide.bind(this) }),
        _react2['default'].createElement(
          'div',
          { className: 'syn-modal-container' },
          _react2['default'].createElement(
            'header',
            { className: 'syn-modal-header' },
            _react2['default'].createElement(
              'h1',
              null,
              this.props.title
            )
          ),
          _react2['default'].createElement(
            'section',
            null,
            this.props.children
          ),
          _react2['default'].createElement(
            'footer',
            null,
            _react2['default'].createElement(
              'a',
              { href: '', onClick: this.hide.bind(this) },
              'X CLOSE'
            )
          )
        )
      );
    }
  }]);

  return Modal;
})(_react2['default'].Component);

exports['default'] = Modal;
module.exports = exports['default'];