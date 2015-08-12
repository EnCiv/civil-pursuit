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

var _uploader = require('./uploader');

var _uploader2 = _interopRequireDefault(_uploader);

var _utilTextInput = require('./util/text-input');

var _utilTextInput2 = _interopRequireDefault(_utilTextInput);

var _utilTextArea = require('./util/text-area');

var _utilTextArea2 = _interopRequireDefault(_utilTextArea);

var _utilSubmit = require('./util/submit');

var _utilSubmit2 = _interopRequireDefault(_utilSubmit);

var _utilIcon = require('./util/icon');

var _utilIcon2 = _interopRequireDefault(_utilIcon);

var _utilForm = require('./util/form');

var _utilForm2 = _interopRequireDefault(_utilForm);

var Creator = (function (_React$Component) {
  function Creator() {
    _classCallCheck(this, Creator);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Creator, _React$Component);

  _createClass(Creator, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var subject = _react2['default'].findDOMNode(this.refs.subject);
      var reference = _react2['default'].findDOMNode(this.refs.reference);
      var description = _react2['default'].findDOMNode(this.refs.description);
      var media = _react2['default'].findDOMNode(this.refs.media);
      var creator = _react2['default'].findDOMNode(this.refs.creator);

      var mediaHeight = media.offsetHeight;
      var inputHeight = subject.offsetHeight + reference.offsetHeight;

      description.style.height = mediaHeight - inputHeight + 'px';
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        _utilForm2['default'],
        null,
        _react2['default'].createElement(
          'article',
          { className: 'item', ref: 'creator' },
          _react2['default'].createElement(
            'section',
            { className: 'item-media-wrapper' },
            _react2['default'].createElement(
              'section',
              { className: 'item-media' },
              _react2['default'].createElement(_uploader2['default'], { ref: 'media' })
            )
          ),
          _react2['default'].createElement(
            'section',
            { className: 'item-buttons' },
            _react2['default'].createElement(
              _utilSubmit2['default'],
              { radius: true },
              _react2['default'].createElement(_utilIcon2['default'], { icon: 'bullhorn' })
            )
          ),
          _react2['default'].createElement(
            'section',
            { className: 'item-text' },
            _react2['default'].createElement(
              'div',
              { className: 'item-inputs' },
              _react2['default'].createElement(_utilTextInput2['default'], { block: true, placeholder: 'Subject', ref: 'subject', required: true }),
              _react2['default'].createElement(_utilTextInput2['default'], { block: true, placeholder: 'http://', ref: 'reference' }),
              _react2['default'].createElement(_utilTextArea2['default'], { block: true, placeholder: 'Description', ref: 'description', required: true })
            )
          ),
          _react2['default'].createElement('section', { style: { clear: 'both' } })
        )
      );
    }
  }]);

  return Creator;
})(_react2['default'].Component);

exports['default'] = Creator;
module.exports = exports['default'];