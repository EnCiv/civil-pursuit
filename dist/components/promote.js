'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

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

var _itemMedia = require('./item-media');

var _itemMedia2 = _interopRequireDefault(_itemMedia);

var _utilLoading = require('./util/loading');

var _utilLoading2 = _interopRequireDefault(_utilLoading);

var _sliders = require('./sliders');

var _sliders2 = _interopRequireDefault(_sliders);

var _utilTextArea = require('./util/text-area');

var _utilTextArea2 = _interopRequireDefault(_utilTextArea);

var _utilButton = require('./util/button');

var _utilButton2 = _interopRequireDefault(_utilButton);

var _libAppComponent = require('../lib/app/component');

var _libAppComponent2 = _interopRequireDefault(_libAppComponent);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var Header = (function (_React$Component) {
  function Header() {
    _classCallCheck(this, Header);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Header, _React$Component);

  _createClass(Header, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'header',
        { className: 'text-center gutter-bottom' },
        _react2['default'].createElement(
          'h2',
          null,
          this.props.cursor,
          ' of ',
          this.props.limit
        ),
        _react2['default'].createElement(
          'h4',
          null,
          'Evaluate each item below'
        )
      );
    }
  }]);

  return Header;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var Subject = (function (_React$Component2) {
  function Subject() {
    _classCallCheck(this, Subject);

    if (_React$Component2 != null) {
      _React$Component2.apply(this, arguments);
    }
  }

  _inherits(Subject, _React$Component2);

  _createClass(Subject, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'h4',
        null,
        this.props.subject
      );
    }
  }]);

  return Subject;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var Description = (function (_React$Component3) {
  function Description() {
    _classCallCheck(this, Description);

    if (_React$Component3 != null) {
      _React$Component3.apply(this, arguments);
    }
  }

  _inherits(Description, _React$Component3);

  _createClass(Description, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'section',
        null,
        this.props.description
      );
    }
  }]);

  return Description;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var Reference = (function (_React$Component4) {
  function Reference() {
    _classCallCheck(this, Reference);

    if (_React$Component4 != null) {
      _React$Component4.apply(this, arguments);
    }
  }

  _inherits(Reference, _React$Component4);

  _createClass(Reference, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'h5',
        null,
        _react2['default'].createElement(
          'a',
          { href: this.props.url, rel: 'nofollow', target: '_blank' },
          this.props.title || this.props.url
        )
      );
    }
  }]);

  return Reference;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var Feedback = (function (_React$Component5) {
  function Feedback() {
    _classCallCheck(this, Feedback);

    if (_React$Component5 != null) {
      _React$Component5.apply(this, arguments);
    }
  }

  _inherits(Feedback, _React$Component5);

  _createClass(Feedback, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'div',
        this.props,
        _react2['default'].createElement(_utilTextArea2['default'], { block: true, placeholder: 'Can you provide feedback that would encourage the author to create a statement that more people would unite around?' })
      );
    }
  }]);

  return Feedback;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var PromoteButton = (function (_React$Component6) {
  function PromoteButton() {
    _classCallCheck(this, PromoteButton);

    if (_React$Component6 != null) {
      _React$Component6.apply(this, arguments);
    }
  }

  _inherits(PromoteButton, _React$Component6);

  _createClass(PromoteButton, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        _utilButton2['default'],
        _extends({ block: true }, this.props),
        this.props.subject
      );
    }
  }]);

  return PromoteButton;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var EditAndGoAgain = (function (_React$Component7) {
  function EditAndGoAgain() {
    _classCallCheck(this, EditAndGoAgain);

    if (_React$Component7 != null) {
      _React$Component7.apply(this, arguments);
    }
  }

  _inherits(EditAndGoAgain, _React$Component7);

  _createClass(EditAndGoAgain, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        _utilButton2['default'],
        _extends({ block: true }, this.props),
        _react2['default'].createElement(
          'i',
          null,
          'Edit and go again'
        )
      );
    }
  }]);

  return EditAndGoAgain;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var Finish = (function (_React$Component8) {
  function Finish() {
    _classCallCheck(this, Finish);

    if (_React$Component8 != null) {
      _React$Component8.apply(this, arguments);
    }
  }

  _inherits(Finish, _React$Component8);

  _createClass(Finish, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        _utilButton2['default'],
        _extends({ block: true }, this.props),
        _react2['default'].createElement(
          'b',
          null,
          'Neither'
        )
      );
    }
  }]);

  return Finish;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var Promote = (function (_React$Component9) {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function Promote(props) {
    _classCallCheck(this, Promote);

    _get(Object.getPrototypeOf(Promote.prototype), 'constructor', this).call(this, props);

    this.status = 'iddle';

    this.state = {
      cursor: 1
    };
  }

  _inherits(Promote, _React$Component9);

  _createClass(Promote, [{
    key: 'componentWillReceiveProps',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function componentWillReceiveProps(props) {
      if (props.show && this.status === 'iddle') {
        this.status = 'ready';
        this.get();
      }
    }
  }, {
    key: 'get',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function get() {
      var _this = this;

      if (typeof window !== 'undefined') {
        window.socket.emit('get evaluation', this.props.item).on('OK get evaluation', function (evaluation) {
          console.log('GOT EVALUATION', evaluation);
          var limit = 5;

          _this.items = evaluation.items;

          _this.setState({
            limit: limit,
            left: evaluation.items[0],
            right: evaluation.items[1],
            criterias: evaluation.criterias
          });
        });
      }
    }
  }, {
    key: 'next',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function next(position) {
      console.log('next', position);

      var _state = this.state;
      var cursor = _state.cursor;
      var limit = _state.limit;
      var left = _state.left;
      var right = _state.right;

      if (cursor < limit) {
        if (!position) {
          cursor += 2;
        } else {
          cursor += 1;
        }

        switch (position) {
          case 'left':
            left = this.items[cursor];
            break;
          case 'right':
            right = this.items[cursor];
            break;
        }

        this.setState({ cursor: cursor, left: left, right: right });
      }
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render() {

      var content = _react2['default'].createElement(_utilLoading2['default'], null);

      if (this.state.limit) {
        content = [];

        content.push(_react2['default'].createElement(Header, this.state), _react2['default'].createElement(
          _utilRow2['default'],
          { 'data-stack': 'phone-and-down' },
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '50', key: 'left', className: 'promote-left' },
            _react2['default'].createElement(_itemMedia2['default'], { item: this.state.left }),
            _react2['default'].createElement(Subject, { subject: this.state.left.subject }),
            _react2['default'].createElement(Reference, this.state.left.references[0]),
            _react2['default'].createElement(Description, { description: this.state.left.description }),
            _react2['default'].createElement('div', { style: { clear: 'both' } }),
            _react2['default'].createElement(_sliders2['default'], { criterias: this.state.criterias, className: 'promote-sliders' }),
            _react2['default'].createElement(Feedback, { className: 'gutter-top' }),
            _react2['default'].createElement(
              'div',
              { 'data-screen': 'phone-and-down', className: 'gutter-top' },
              _react2['default'].createElement(PromoteButton, _extends({}, this.state.left, { onClick: this.next.bind(this, 'left') })),
              _react2['default'].createElement(EditAndGoAgain, null)
            )
          ),
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '50', key: 'right', className: 'promote-right' },
            _react2['default'].createElement(_itemMedia2['default'], { item: this.state.right }),
            _react2['default'].createElement(Subject, { subject: this.state.right.subject }),
            _react2['default'].createElement(Reference, this.state.right.references[0]),
            _react2['default'].createElement(Description, { description: this.state.right.description }),
            _react2['default'].createElement('div', { style: { clear: 'both' } }),
            _react2['default'].createElement(_sliders2['default'], { criterias: this.state.criterias, className: 'promote-sliders' }),
            _react2['default'].createElement(Feedback, { className: 'gutter-top' }),
            _react2['default'].createElement(
              'div',
              { 'data-screen': 'phone-and-down', className: 'gutter-top' },
              _react2['default'].createElement(PromoteButton, _extends({}, this.state.right, { onClick: this.next.bind(this, 'right') })),
              _react2['default'].createElement(EditAndGoAgain, null)
            )
          )
        ), _react2['default'].createElement(
          'h5',
          { 'data-screen': 'phone-and-up', className: 'text-center gutter' },
          'Which of these is most important for the community to consider?'
        ), _react2['default'].createElement(
          _utilRow2['default'],
          { 'data-stack': 'phone-and-down', 'data-screen': 'phone-and-up' },
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '50', key: 'left', className: 'promote-left' },
            _react2['default'].createElement(PromoteButton, _extends({}, this.state.left, { onClick: this.next.bind(this, 'left') })),
            _react2['default'].createElement(EditAndGoAgain, { className: 'gutter-top' })
          ),
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '50', key: 'right', className: 'promote-right' },
            _react2['default'].createElement(PromoteButton, _extends({}, this.state.right, { onClick: this.next.bind(this, 'right') })),
            _react2['default'].createElement(EditAndGoAgain, { className: 'gutter-top' })
          )
        ), _react2['default'].createElement(
          'div',
          { className: 'gutter' },
          _react2['default'].createElement(Finish, _extends({}, this.state, { onClick: this.next.bind(this, null) }))
        ));
      }

      return _react2['default'].createElement(
        'section',
        { className: 'item-promote ' + this.props.className },
        content
      );
    }
  }]);

  return Promote;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

exports['default'] = Promote;
module.exports = exports['default'];