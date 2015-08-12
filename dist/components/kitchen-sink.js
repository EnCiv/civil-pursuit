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

var _utilButton = require('./util/button');

var _utilButton2 = _interopRequireDefault(_utilButton);

var _utilButtonGroup = require('./util/button-group');

var _utilButtonGroup2 = _interopRequireDefault(_utilButtonGroup);

var _utilInputGroup = require('./util/input-group');

var _utilInputGroup2 = _interopRequireDefault(_utilInputGroup);

var _utilModal = require('./util/modal');

var _utilModal2 = _interopRequireDefault(_utilModal);

var _utilTextInput = require('./util/text-input');

var _utilTextInput2 = _interopRequireDefault(_utilTextInput);

var _utilSelect = require('./util/select');

var _utilSelect2 = _interopRequireDefault(_utilSelect);

var KitchenSink = (function (_React$Component) {
  function KitchenSink() {
    _classCallCheck(this, KitchenSink);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(KitchenSink, _React$Component);

  _createClass(KitchenSink, [{
    key: 'toggleModal',
    value: function toggleModal() {
      var modal = _react2['default'].findDOMNode(this.refs.modal);

      modal.classList.add('syn--visible');
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'section',
        null,
        _react2['default'].createElement(
          'article',
          null,
          _react2['default'].createElement('hr', null),
          _react2['default'].createElement(
            'h1',
            null,
            'Typo'
          ),
          _react2['default'].createElement('hr', null),
          _react2['default'].createElement(
            'h1',
            null,
            'This is a h1'
          ),
          _react2['default'].createElement(
            'h2',
            null,
            'This is a h2'
          ),
          _react2['default'].createElement(
            'h3',
            null,
            'This is a h3'
          ),
          _react2['default'].createElement(
            'h4',
            null,
            'This is a h4'
          ),
          _react2['default'].createElement(
            'h5',
            null,
            'This is a h5'
          )
        ),
        _react2['default'].createElement(
          'article',
          null,
          _react2['default'].createElement('hr', null),
          _react2['default'].createElement(
            'h1',
            null,
            'Buttons'
          ),
          _react2['default'].createElement('hr', null),
          _react2['default'].createElement(
            _utilButton2['default'],
            null,
            'This is a button'
          ),
          _react2['default'].createElement(
            _utilButton2['default'],
            { shy: true },
            'This is a shy button'
          ),
          _react2['default'].createElement(
            _utilButton2['default'],
            { info: true },
            'This is a info button'
          ),
          _react2['default'].createElement(
            _utilButton2['default'],
            { primary: true },
            'This is a primary button'
          ),
          _react2['default'].createElement(
            _utilButton2['default'],
            { success: true },
            'This is a success button'
          ),
          _react2['default'].createElement(
            _utilButton2['default'],
            { error: true },
            'This is a error button'
          ),
          _react2['default'].createElement(
            _utilButton2['default'],
            { warning: true },
            'This is a warning button'
          ),
          _react2['default'].createElement(
            'p',
            null,
            _react2['default'].createElement(
              _utilButton2['default'],
              { small: true },
              'This is a small button'
            ),
            _react2['default'].createElement(
              _utilButton2['default'],
              { medium: true },
              'This is a medium button'
            ),
            _react2['default'].createElement(
              _utilButton2['default'],
              { large: true },
              'This is a large button'
            )
          ),
          _react2['default'].createElement(
            'p',
            null,
            _react2['default'].createElement(
              _utilButton2['default'],
              { block: true },
              'This is a block button'
            )
          ),
          _react2['default'].createElement('hr', null),
          _react2['default'].createElement(
            'h2',
            null,
            'Buttons groups'
          ),
          _react2['default'].createElement('hr', null),
          _react2['default'].createElement(
            'p',
            null,
            _react2['default'].createElement(
              _utilButtonGroup2['default'],
              null,
              _react2['default'].createElement(
                _utilButton2['default'],
                { primary: true },
                'This is a primary button'
              ),
              _react2['default'].createElement(
                _utilButton2['default'],
                { success: true },
                'This is a success button'
              ),
              _react2['default'].createElement(
                _utilButton2['default'],
                { error: true },
                'This is a error button'
              )
            )
          ),
          _react2['default'].createElement(
            'p',
            null,
            _react2['default'].createElement(
              _utilButtonGroup2['default'],
              { block: true },
              _react2['default'].createElement(
                _utilButton2['default'],
                { primary: true },
                'This is a primary button'
              ),
              _react2['default'].createElement(
                _utilButton2['default'],
                { success: true },
                'This is a success button'
              ),
              _react2['default'].createElement(
                _utilButton2['default'],
                { error: true },
                'This is a error button'
              )
            )
          )
        ),
        _react2['default'].createElement(
          'article',
          null,
          _react2['default'].createElement('hr', null),
          _react2['default'].createElement(
            'h1',
            null,
            'Modals'
          ),
          _react2['default'].createElement('hr', null),
          _react2['default'].createElement(
            _utilButton2['default'],
            { primar: true, onClick: this.toggleModal.bind(this) },
            'Click to call modal'
          ),
          _react2['default'].createElement(_utilModal2['default'], { title: 'Hey! I am a modal', ref: 'modal' })
        ),
        _react2['default'].createElement(
          'article',
          null,
          _react2['default'].createElement('hr', null),
          _react2['default'].createElement(
            'h1',
            null,
            'Inputs'
          ),
          _react2['default'].createElement('hr', null),
          _react2['default'].createElement(_utilTextInput2['default'], { placeholder: 'This is a text input' }),
          _react2['default'].createElement(_utilTextInput2['default'], { placeholder: 'This is a block text input', block: true }),
          _react2['default'].createElement(_utilTextInput2['default'], { placeholder: 'This is a small text input', block: true, small: true }),
          _react2['default'].createElement(_utilTextInput2['default'], { placeholder: 'This is a medium text input', block: true, medium: true }),
          _react2['default'].createElement(_utilTextInput2['default'], { placeholder: 'This is a large text input', block: true, large: true }),
          _react2['default'].createElement(
            'p',
            null,
            _react2['default'].createElement(
              _utilInputGroup2['default'],
              null,
              _react2['default'].createElement(_utilTextInput2['default'], { placeholder: 'This is a text input' }),
              _react2['default'].createElement(_utilTextInput2['default'], { placeholder: 'This is a text input' }),
              _react2['default'].createElement(_utilTextInput2['default'], { placeholder: 'This is a text input' })
            )
          ),
          _react2['default'].createElement(
            'p',
            null,
            _react2['default'].createElement(
              _utilInputGroup2['default'],
              { block: true },
              _react2['default'].createElement(_utilTextInput2['default'], { placeholder: 'This is a text input' }),
              _react2['default'].createElement(_utilTextInput2['default'], { placeholder: 'This is a text input' }),
              _react2['default'].createElement(_utilTextInput2['default'], { placeholder: 'This is a text input' })
            )
          ),
          _react2['default'].createElement(_utilSelect2['default'], null),
          _react2['default'].createElement(_utilSelect2['default'], { small: true }),
          _react2['default'].createElement(_utilSelect2['default'], { medium: true }),
          _react2['default'].createElement(_utilSelect2['default'], { large: true })
        )
      );
    }
  }]);

  return KitchenSink;
})(_react2['default'].Component);

exports['default'] = KitchenSink;
module.exports = exports['default'];